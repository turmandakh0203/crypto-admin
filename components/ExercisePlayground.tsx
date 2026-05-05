"use client";
import { useState } from "react";

type InputConfig = {
  id: string;
  label: string;
  default?: string;
  type?: "text" | "number" | "textarea";
};

type ActionConfig = {
  label: string;
  style?: "green" | "yellow" | "red" | "blue" | "accent";
  fn: string; // JS function body — inputs объектоос утга авч return хийнэ
};

export type ExerciseConfig = {
  title?: string;
  inputs: InputConfig[];
  actions: ActionConfig[];
};

const ACTION_COLORS: Record<string, string> = {
  green: "bg-[#50D880]/10 text-[#50D880] hover:border hover:border-[#3fc46a] border-[#50D880]",
  yellow: "bg-[#D4A020]/10 text-[#D4A020] hover:border hover:border-[#b88a18] border-[#D4A020]",
  red: "bg-[#e63329]/10 text-[#e63329] hover:border hover:border-[#c42820] border-[#e63329]",
  blue: "bg-[#3060B0]/10 text-[#3060B0] hover:border hover:border-[#254e96] border-[#3060B0]",
  accent: "bg-accent/10 text-accent hover:border hover:border-[#c42820] border-accent",
};

type Props = { config: ExerciseConfig };

export default function ExercisePlayground({ config }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(config.inputs.map((i) => [i.id, i.default ?? ""]))
  );
  const [output, setOutput] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = (action: ActionConfig) => {
    try {
      const fn = new Function("inputs", action.fn);
      const result = fn(values);
      setOutput(result == null ? "" : String(result));
      setActiveAction(action.label);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
      setOutput(null);
    }
  };

  return (
    <div className="mt-8 border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-9 border-b border-border bg-surface">
        <div className="w-2 h-2 rounded-full bg-[#50D880]" />
        <span className="text-[9px] tracking-[0.1em] uppercase text-muted font-ttNormsPro">
          {config.title ?? "Туршилт хийх"}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Оролтууд */}
        {config.inputs.map((input) => (
          <div key={input.id}>
            <label className="block mb-1.5">
              <span className="text-[8px] tracking-[0.14em] uppercase rounded-full font-mono text-accent bg-accent/10 border border-accent px-2 py-1">
                {input.label}
              </span>
            </label>
            {input.type === "textarea" ? (
              <textarea
                value={values[input.id]}
                onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                rows={4}
                className="w-full bg-surface rounded-lg border border-border text-ink text-[12px] font-mono leading-[1.7] px-3 py-2 outline-none focus:border-muted resize-y"
              />
            ) : (
              <input
                type={input.type ?? "text"}
                value={values[input.id]}
                onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                className="w-full bg-surface rounded-lg border border-border text-ink text-[12px] font-mono px-3 py-2 outline-none focus:border-muted"
              />
            )}
          </div>
        ))}

        {/* Товчнууд */}
        <div className="flex items-center gap-3 flex-wrap">
          {config.actions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleAction(action)}
              className={`px-5 py-2 text-[12px] font-bold font-ttNormsPro tracking-wide rounded-full transition-colors ${ACTION_COLORS[action.style ?? "accent"] ?? ACTION_COLORS.accent}`}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Гаралт */}
        {(output !== null || error) && (
          <div className="border border-border overflow-hidden">
            <div
              className={`flex items-center justify-between px-3 py-1.5 border-b border-border ${error ? "bg-accent/10" : "bg-surface"}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${error ? "bg-accent" : "bg-[#50D880]"}`}
                />
                <span
                  className={`text-[8px] tracking-[0.14em] uppercase font-mono ${error ? "text-accent" : "text-[#50D880]"}`}
                >
                  {error ? "Алдаа" : `${activeAction} — Үр дүн`}
                </span>
              </div>
              <button
                onClick={() => {
                  setOutput(null);
                  setError(null);
                }}
                className="text-[10px] text-muted hover:text-ink font-mono transition-colors"
              >
                ✕
              </button>
            </div>
            <pre
              className={`px-4 py-4 font-mono text-[12px] leading-[1.9] whitespace-pre-wrap bg-[#050505] overflow-x-auto ${error ? "text-accent" : "text-[#f0ece0]"}`}
            >
              {error ?? output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
