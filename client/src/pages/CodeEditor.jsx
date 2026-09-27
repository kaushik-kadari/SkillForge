import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { toast } from "react-toastify";
import { Play, Copy, Trash2, Download, Terminal, Code2 } from "lucide-react";

const languages = {
  javascript: {
    sampleCode: "// Write your JavaScript code here...\n\nconsole.log('Hello, World!');"
  },
  python: {
    sampleCode: "# Write your Python code here...\n\nprint('Hello, World!')"
  },
  java: {
    sampleCode:
      "// Write your Java code here...\n\nclass Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}"
  },
  c: {
    sampleCode: "// Write your C code here...\n\n#include <stdio.h>\n\nint main() {\n  printf(\"Hello, World!\\n\");\n  return 0;\n}"
  },
  cpp: {
    sampleCode: "// Write your C++ code here...\n\n#include <iostream>\n\nint main() {\n  std::cout << \"Hello, World!\" << std::endl;\n  return 0;\n}"
  },
  csharp: {
    sampleCode: "// Write your C# code here...\n\nusing System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine(\"Hello, World!\");\n  }\n}"
  },
  ruby: {
    sampleCode: "# Write your Ruby code here...\n\nputs 'Hello, World!'"
  },
  typescript: {
    sampleCode: "// Write your TypeScript code here...\n\nconsole.log('Hello, World!');"
  },
  go: {
    sampleCode: "// Write your Go code here...\n\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n  fmt.Println(\"Hello, World!\")\n}"
  },
  php: {
    sampleCode: "<?php\n// Write your PHP code here...\n\necho \"Hello, World!\";\n?>"
  }
};

const languageLabels = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  ruby: "Ruby",
  typescript: "TypeScript",
  go: "Go",
  php: "PHP",
};

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [compileError, setCompileError] = useState(false);
  const [running, setRunning] = useState(false);
  const [mobilePanel, setMobilePanel] = useState("editor");
  const serverUrl = import.meta.env.VITE_serverUrl;

  useEffect(() => {
    const savedCode = sessionStorage.getItem(`code-${language}`);
    setCode(savedCode || languages[language].sampleCode);
  }, [language]);

  useEffect(() => {
    sessionStorage.setItem(`code-${language}`, code);
  }, [code, language]);

  const handleRun = async () => {
    setRunning(true);
    setOutput("Running...");
    setCompileError(false);
    setMobilePanel("output");
    try {
      const res = await axios.post(`${serverUrl}execute-code`, {
        language,
        code,
      });
      const { output: resultOutput, isError } = res.data;
      setCompileError(Boolean(isError));
      setOutput(resultOutput || "No output.");
    } catch (error) {
      console.error("Error running code:", error);
      setCompileError(true);
      const message =
        error.response?.data?.error || "Failed to run code. Please try again.";
      setOutput(message);
      toast.error(message);
    } finally {
      setRunning(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch {
      toast.error("Failed to copy code.");
    }
  };

  const clearEditor = () => {
    setCode("");
  };

  const clearOutput = () => {
    setOutput("");
    setCompileError(false);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const date = new Date().toISOString().split("T")[0];
    link.download = `${language}_code_${date}.txt`;
    link.click();
  };

  const statusStyles = !output
    ? "bg-[#e4e2e2] text-gray-600"
    : running
      ? "bg-[#e4e2e2] text-gray-700 animate-pulse"
      : compileError
        ? "bg-red-100 text-red-700"
        : "bg-emerald-100 text-emerald-800";

  const outputStatus = !output
    ? "Idle"
    : running
      ? "Running"
      : compileError
        ? "Error"
        : "Done";

  return (
    <div className="h-[calc(100dvh-max(80px,10vh))] max-h-[calc(100dvh-max(80px,10vh))] w-full min-w-0 flex flex-col overflow-hidden px-2 py-2 sm:px-3 sm:py-3 md:px-5 md:py-4">
      <div className="flex-1 min-h-0 min-w-0 flex flex-col max-w-[1600px] w-full mx-auto rounded-xl sm:rounded-2xl border border-black/10 bg-[#ebe7de]/50 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.18)] overflow-hidden">
        {/* Top bar */}
        <div className="shrink-0 bg-[#e4e2e2] border-b border-black/8">
          <div className="px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 flex flex-col gap-2.5 sm:gap-3">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-black text-white shrink-0">
                  <Code2 size={18} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-black leading-tight truncate">
                    CodePlay
                  </h1>
                  <p className="text-xs text-gray-600 hidden sm:block">
                    Write, run, and iterate instantly
                  </p>
                </div>
              </div>

              {/* Mobile: compact Run always visible */}
              <button
                onClick={handleRun}
                disabled={running}
                className="sm:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-[#4f4f4f] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                <Play size={14} fill="currentColor" />
                {running ? "…" : "Run"}
              </button>
            </div>

            <div className="flex flex-col xs:flex-row sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
              <div className="relative flex-1 min-w-0 sm:flex-none sm:min-w-[10rem]">
                <select
                  className="appearance-none [-webkit-appearance:none] [-moz-appearance:none] w-full pl-3 pr-9 py-2 border border-black/15 rounded-xl bg-white/90 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-black/15 cursor-pointer hover:bg-white transition-colors bg-none"
                  style={{ backgroundImage: "none" }}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {Object.keys(languages).map((lang) => (
                    <option key={lang} value={lang}>
                      {languageLabels[lang] || lang.toUpperCase()}
                    </option>
                  ))}
                </select>
                <span
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs leading-none"
                  aria-hidden
                >
                  ▾
                </span>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/60 border border-black/8 shadow-sm w-full sm:w-auto sm:ml-auto justify-between sm:justify-start">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="hidden sm:inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-[#4f4f4f] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  <Play size={15} fill="currentColor" />
                  {running ? "Running…" : "Run"}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 p-2 rounded-lg text-gray-700 hover:bg-[#e4e2e2] hover:text-black transition-colors text-xs font-semibold sm:text-inherit sm:font-normal"
                  title="Copy code"
                  aria-label="Copy code"
                >
                  <Copy size={17} />
                  <span className="sm:hidden">Copy</span>
                </button>
                <button
                  onClick={clearEditor}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 p-2 rounded-lg text-gray-700 hover:bg-[#e4e2e2] hover:text-black transition-colors text-xs font-semibold sm:text-inherit sm:font-normal"
                  title="Clear editor"
                  aria-label="Clear editor"
                >
                  <Trash2 size={17} />
                  <span className="sm:hidden">Clear</span>
                </button>
                <button
                  onClick={downloadCode}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 p-2 rounded-lg text-gray-700 hover:bg-[#e4e2e2] hover:text-black transition-colors text-xs font-semibold sm:text-inherit sm:font-normal"
                  title="Download code"
                  aria-label="Download code"
                >
                  <Download size={17} />
                  <span className="sm:hidden">Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile panel tabs */}
          <div className="lg:hidden flex gap-1 p-1 mx-3 mb-2.5 sm:mx-4 rounded-xl bg-white/50 border border-black/8">
            <button
              type="button"
              onClick={() => setMobilePanel("editor")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                mobilePanel === "editor"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black hover:bg-black/5"
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setMobilePanel("output")}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                mobilePanel === "output"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black hover:bg-black/5"
              }`}
            >
              Output
              {output && !running && (
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    mobilePanel === "output"
                      ? "bg-white/80"
                      : compileError
                        ? "bg-red-500"
                        : "bg-emerald-500"
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Panels */}
        <div className="flex-1 min-h-0 min-w-0 flex flex-col lg:flex-row overflow-hidden">
          {/* Editor */}
          <section
            className={`min-h-0 min-w-0 flex-col lg:flex lg:flex-1 lg:w-1/2 lg:border-r border-black/8 ${
              mobilePanel === "editor" ? "flex flex-1" : "hidden"
            }`}
          >
            <div className="shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between bg-[#f5f2e9]/90">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex gap-1 shrink-0" aria-hidden>
                  <span className="w-2 h-2 rounded-full bg-[#d4cfc4]" />
                  <span className="w-2 h-2 rounded-full bg-[#d4cfc4]" />
                  <span className="w-2 h-2 rounded-full bg-[#d4cfc4]" />
                </span>
                <span className="text-sm font-semibold text-gray-800">Editor</span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 bg-white/70 px-2 py-0.5 rounded-md border border-black/5 truncate max-w-[40%]">
                {languageLabels[language] || language}
              </span>
            </div>
            <div className="flex-1 min-h-0 p-1.5 sm:p-2 md:p-3">
              <div className="h-full min-h-0 rounded-lg sm:rounded-xl overflow-hidden border border-black/10 shadow-inner ring-1 ring-black/5">
                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={(newCode) => setCode(newCode ?? "")}
                  options={{
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    minimap: { enabled: false },
                    fontSize: 13,
                    padding: { top: 10, bottom: 10 },
                    lineHeight: 20,
                    renderLineHighlight: "line",
                    cursorBlinking: "smooth",
                    scrollbar: {
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                    },
                  }}
                />
              </div>
            </div>
          </section>

          {/* Output */}
          <section
            className={`min-h-0 min-w-0 flex-col lg:flex lg:flex-1 lg:w-1/2 ${
              mobilePanel === "output" ? "flex flex-1" : "hidden"
            }`}
          >
            <div className="shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 bg-[#f5f2e9]/90">
              <div className="flex items-center gap-2 min-w-0">
                <Terminal size={15} className="text-gray-600 shrink-0" />
                <span className="text-sm font-semibold text-gray-800">Output</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyles}`}
                >
                  {outputStatus}
                </span>
                {output && (
                  <button
                    onClick={clearOutput}
                    className="text-xs font-semibold text-gray-500 hover:text-black px-2 py-0.5 rounded-md hover:bg-black/5 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 min-h-0 p-1.5 sm:p-2 md:p-3">
              <div
                className={`h-full min-h-0 p-3 sm:p-4 md:p-5 bg-[#111] rounded-lg sm:rounded-xl overflow-auto font-mono text-xs sm:text-sm border border-black/20 shadow-inner ${
                  compileError ? "text-red-400" : "text-emerald-100"
                }`}
              >
                {output ? (
                  <pre className="whitespace-pre-wrap break-words m-0 leading-relaxed">
                    {output}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-2 px-2">
                    <Terminal size={28} className="opacity-40" />
                    <p className="m-0 text-sm">Run code to see output here</p>
                    <p className="m-0 text-xs opacity-70">
                      Press Run or try a quick Hello World
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
