import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { buildSystemPrompt, buildUserMessage, type GenerateInput } from "@/lib/system-prompt";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 300;

const InputSchema = z.object({
  script: z.string().min(10).max(20000),
  style: z.string().min(1).max(100),
  episodeCount: z.number().int().min(1).max(20),
  episodeDuration: z.number().int().min(5).max(60),
  aspectRatio: z.enum(["9:16", "16:9", "1:1"]),
  platforms: z.array(z.enum(["kling", "seedance"])).min(1),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("Server not configured: ANTHROPIC_API_KEY missing", {
      status: 500,
    });
  }

  let body: GenerateInput;
  try {
    const json = await req.json();
    body = InputSchema.parse(json);
  } catch {
    return new Response("Invalid input", { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = await anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 16000,
          system: [
            {
              type: "text",
              text: buildSystemPrompt(),
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [
            {
              role: "user",
              content: buildUserMessage(body),
            },
          ],
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`\n\n**[錯誤]** ${msg}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
