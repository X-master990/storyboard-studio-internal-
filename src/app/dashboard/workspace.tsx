"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Copy, Download, Check, Square, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = [
  { value: "寫實電影感", label: "寫實電影感" },
  { value: "水墨武俠", label: "水墨武俠" },
  { value: "動漫賽璐璐", label: "動漫賽璐璐" },
  { value: "3D Pixar 風", label: "3D Pixar 風" },
  { value: "賽博龐克", label: "賽博龐克" },
  { value: "復古港片", label: "復古港片" },
  { value: "韓劇浪漫", label: "韓劇浪漫" },
];

export default function Workspace() {
  const [script, setScript] = useState("");
  const [style, setStyle] = useState(STYLES[0].value);
  const [autoEstimate, setAutoEstimate] = useState(true);
  const [episodeCount, setEpisodeCount] = useState(1);
  const [episodeDuration, setEpisodeDuration] = useState(20);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9" | "1:1">(
    "9:16"
  );
  const [platforms, setPlatforms] = useState<("kling" | "seedance")[]>([
    "kling",
  ]);

  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  function togglePlatform(p: "kling" | "seedance") {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!script.trim() || isGenerating) return;
    if (platforms.length === 0) return;

    setOutput("");
    setIsGenerating(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          style,
          episodeCount: autoEstimate ? null : episodeCount,
          episodeDuration: autoEstimate ? null : episodeDuration,
          aspectRatio,
          platforms,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        setOutput(`**錯誤：** ${text}`);
        setIsGenerating(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        acc += chunk;
        setOutput(acc);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setOutput((prev) => prev + `\n\n**[連線錯誤]** ${(err as Error).message}`);
      }
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `storyboard-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const totalSeconds = episodeCount * episodeDuration;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 h-full">
      {/* 左：輸入表單 */}
      <form
        onSubmit={handleGenerate}
        className="flex flex-col gap-5 rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-5 h-fit lg:sticky lg:top-20"
      >
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            原始劇本 / 故事大綱
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="貼上你的劇本、故事大綱、或一句概念..."
            rows={10}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm placeholder:text-neutral-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-y"
            required
            minLength={10}
          />
          <p className="text-xs text-neutral-500 mt-1">
            {script.length} 字
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            視覺風格
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            {STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={autoEstimate}
              onChange={(e) => setAutoEstimate(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
            />
            <span className="text-sm font-medium text-neutral-300 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-violet-400" />
              讓 AI 自動估算集數與秒數
            </span>
          </label>

          {autoEstimate ? (
            <div className="text-xs text-neutral-500 rounded-lg bg-violet-500/5 border border-violet-500/20 px-3 py-2 mt-2">
              AI 自動切集 + 自動拆分 Kling clip（每 clip ≤ 12 秒）
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  集數
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={episodeCount}
                  onChange={(e) => setEpisodeCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  每集秒數
                </label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  step={1}
                  value={episodeDuration}
                  onChange={(e) => setEpisodeDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            畫幅
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["9:16", "16:9", "1:1"] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm transition-colors",
                  aspectRatio === ratio
                    ? "border-violet-500 bg-violet-500/10 text-white"
                    : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                )}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            目標平台
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => togglePlatform("kling")}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm transition-colors",
                platforms.includes("kling")
                  ? "border-violet-500 bg-violet-500/10 text-white"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
              )}
            >
              Kling 2.x
            </button>
            <button
              type="button"
              onClick={() => togglePlatform("seedance")}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm transition-colors",
                platforms.includes("seedance")
                  ? "border-violet-500 bg-violet-500/10 text-white"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
              )}
            >
              Seedance 2.0
            </button>
          </div>
        </div>

        {!autoEstimate && (
          <div className="text-xs text-neutral-500 rounded-lg bg-neutral-950/50 border border-neutral-800/50 px-3 py-2">
            總長：<span className="text-neutral-300 font-medium">{totalSeconds} 秒</span>
            （{episodeCount} 集 × {episodeDuration}s）
          </div>
        )}

        {isGenerating ? (
          <button
            type="button"
            onClick={handleStop}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 font-medium hover:bg-red-500/20 transition-colors"
          >
            <Square className="w-4 h-4" />
            停止生成
          </button>
        ) : (
          <button
            type="submit"
            disabled={!script.trim() || platforms.length === 0}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            生成分鏡
          </button>
        )}
      </form>

      {/* 右：輸出區 */}
      <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/30 flex flex-col min-h-[400px]">
        {output ? (
          <>
            <div className="flex items-center justify-between border-b border-neutral-800/60 px-5 py-3">
              <p className="text-sm font-medium text-neutral-300">
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    生成中…
                  </span>
                ) : (
                  "生成結果"
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-neutral-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已複製
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      複製全部
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-neutral-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  下載 .md
                </button>
              </div>
            </div>
            <div className="prose prose-invert prose-neutral max-w-none prose-sm px-6 py-5 overflow-x-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {output}
              </ReactMarkdown>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
            <Sparkles className="w-10 h-10 text-neutral-700 mb-3" />
            <p className="text-neutral-300 font-medium">準備就緒</p>
            <p className="text-sm text-neutral-500 mt-1 max-w-xs">
              左邊填好參數、貼上劇本後，按「生成分鏡」開始
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
