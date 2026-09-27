import React from "react";
import ReactMarkdown from "react-markdown";
import "../Content/Content.css";

/**
 * Shared renderer for AI-generated markdown across the app.
 * tone: "default" | "onDark" (for dark chat bubbles)
 */
export default function MarkdownContent({
  children,
  className = "",
  tone = "default",
  compact = false,
}) {
  const onDark = tone === "onDark";
  const text = onDark ? "text-white" : "text-gray-800";
  const strong = onDark ? "text-white" : "text-black";
  const muted = onDark ? "text-white/80" : "text-gray-700";
  const marker = onDark ? "marker:text-white/60" : "marker:text-gray-500";

  return (
    <div
      className={`markdown-body ${compact ? "markdown-compact" : ""} ${className}`}
    >
      <ReactMarkdown
        components={{
          h1: ({ children: c }) => (
            <h3
              className={`text-lg font-bold mt-3 mb-2 first:mt-0 ${strong}`}
            >
              {c}
            </h3>
          ),
          h2: ({ children: c }) => (
            <h3
              className={`text-base font-bold mt-3 mb-2 first:mt-0 ${strong}`}
            >
              {c}
            </h3>
          ),
          h3: ({ children: c }) => (
            <h4
              className={`text-sm font-bold mt-2.5 mb-1.5 first:mt-0 ${strong}`}
            >
              {c}
            </h4>
          ),
          h4: ({ children: c }) => (
            <h4 className={`text-sm font-semibold mt-2 mb-1 ${strong}`}>{c}</h4>
          ),
          p: ({ children: c }) => (
            <p className={`mb-2 last:mb-0 leading-relaxed ${text}`}>{c}</p>
          ),
          ul: ({ children: c }) => (
            <ul className={`mb-2 last:mb-0 ml-0 list-disc space-y-1 pl-5 ${text}`}>
              {c}
            </ul>
          ),
          ol: ({ children: c }) => (
            <ol
              className={`mb-2 last:mb-0 ml-0 list-decimal space-y-1 pl-5 ${text}`}
            >
              {c}
            </ol>
          ),
          li: ({ children: c }) => (
            <li className={`leading-relaxed ${marker}`}>{c}</li>
          ),
          strong: ({ children: c }) => (
            <strong className={`font-semibold ${strong}`}>{c}</strong>
          ),
          em: ({ children: c }) => <em className={`italic ${muted}`}>{c}</em>,
          code: ({ className, children: c }) => {
            const isBlock = Boolean(className) || String(c).includes("\n");
            if (!isBlock) {
              return (
                <code
                  className={`px-1 py-0.5 rounded text-[0.9em] font-mono ${
                    onDark ? "bg-white/15 text-white" : "bg-black/5 text-gray-900"
                  }`}
                >
                  {c}
                </code>
              );
            }
            return (
              <code
                className={`block w-full overflow-x-auto p-3 my-2 rounded-lg text-[0.85em] font-mono whitespace-pre ${
                  onDark ? "bg-black/40 text-white" : "bg-[#111] text-emerald-100"
                } ${className || ""}`}
              >
                {c}
              </code>
            );
          },
          pre: ({ children: c }) => (
            <pre className="my-2 overflow-x-auto rounded-lg">{c}</pre>
          ),
          a: ({ href, children: c }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-2 ${
                onDark ? "text-white" : "text-black"
              }`}
            >
              {c}
            </a>
          ),
          blockquote: ({ children: c }) => (
            <blockquote
              className={`border-l-4 pl-3 my-2 ${
                onDark
                  ? "border-white/30 text-white/90"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {c}
            </blockquote>
          ),
        }}
      >
        {typeof children === "string" ? children : String(children ?? "")}
      </ReactMarkdown>
    </div>
  );
}
