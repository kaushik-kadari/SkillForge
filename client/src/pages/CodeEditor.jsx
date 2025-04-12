import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const languages = {
  javascript: {
    version: "18.15.0",
    sampleCode: "// Write your JavaScript code here...\n\nconsole.log('Hello, World!');"
  },
  python: {
    version: "3.10.0",
    sampleCode: "# Write your Python code here...\n\nprint('Hello, World!')"
  },
  java: {
    version: "15.0.2",
    sampleCode: "// Write your Java code here...\n\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}"
  },
  c: {
    version: "10.2.0",
    sampleCode: "// Write your C code here...\n\n#include <stdio.h>\n\nint main() {\n  printf(\"Hello, World!\\n\");\n  return 0;\n}"
  },
  cpp: {
    version: "10.2.0",
    sampleCode: "// Write your C++ code here...\n\n#include <iostream>\n\nint main() {\n  std::cout << \"Hello, World!\" << std::endl;\n  return 0;\n}"
  },
  csharp: {
    version: "6.12.0",
    sampleCode: "// Write your C# code here...\n\nusing System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine(\"Hello, World!\");\n  }\n}"
  },
  ruby: {
    version: "3.0.1",
    sampleCode: "# Write your Ruby code here...\n\nputs 'Hello, World!'"
  },
  swift: {
    version: "5.3.3",
    sampleCode: "// Write your Swift code here...\n\nprint(\"Hello, World!\")"
  },
  typescript: {
    version: "5.0.3",
    sampleCode: "// Write your TypeScript code here...\n\nconsole.log('Hello, World!');"
  },
  go: {
    version: "1.16.2",
    sampleCode: "// Write your Go code here...\n\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n  fmt.Println(\"Hello, World!\")\n}"
  },
  kotlin: {
    version: "1.8.20",
    sampleCode: "// Write your Kotlin code here...\n\nfun main() {\n  println(\"Hello, World!\")\n}"
  },
  php: {
    version: "8.2.3",
    sampleCode: "<?php\n// Write your PHP code here...\n\necho \"Hello, World!\";\n?>"
  }
};

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [compileError, setCompileError] = useState(false);

  useEffect(() => {
    const savedCode = sessionStorage.getItem(`code-${language}`);
    setCode(savedCode || languages[language].sampleCode);
  }, [language]);

  useEffect(() => {
    sessionStorage.setItem(`code-${language}`, code);
  }, [code, language]);

  const handleRun = async () => {
    const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: language,
      version: languages[language].version,
      files: [
        { content: code }
      ]
    });
    const { data } = res;
    if(data.run.code == 1) setCompileError(true);
    else setCompileError(false);
    setOutput(data.run.output);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const clearEditor = () => {
    setCode("");
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const date = new Date().toISOString().split("T")[0];
    link.download = `${language}_code_${date}.txt`;
    link.click();
  };

  return (
    <>
      <h1 className="text-3xl font-bold my-5 text-center">Code Editor</h1>
      <div className="flex flex-col sm:flex-row gap-5 md:gap-0">
        {/* Editor Section */}
        <div className="sm:w-1/2 mx-5">
          {/* Header */}
          {/* Language Selector */}
          <select
          className="p-3 border rounded bg-[#f5f2e9] text-sm font-semibold"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {Object.keys(languages).map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Resizable Editor */}
        <div className="mt-3">
          <Editor
            height="50vh"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(newCode) => setCode(newCode)}
            options={{
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              minimap: { enabled: false },
            }}
            className="border rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleRun}
            className="px-4 py-2 bg-[#f5f2e9] text-sm text-black font-semibold border border-black hover:bg-gray-200 transition-all rounded"
          >
            Run Code
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-[#f5f2e9] text-sm text-black font-semibold border border-black hover:bg-gray-200 transition-all rounded"
          >
            Copy Code
          </button>
          <button
            onClick={clearEditor}
            className="px-4 py-2 bg-[#f5f2e9] text-sm text-black font-semibold border border-black hover:bg-gray-200 transition-all rounded"
          >
            Clear Editor
          </button>
          <button
            onClick={downloadCode}
            className="px-4 py-2 bg-[#f5f2e9] text-sm text-black font-semibold border border-black hover:bg-gray-200 transition-all rounded"
          >
            Download Code
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="sm:w-1/2 mx-5 mb-5">
        <button className="text-xl font-semibold mb-2 bg-[#f5f2e9] py-2 px-2 border border-black rounded cursor-default">Output</button>
        <div className={`p-3 bg-black rounded overflow-x-scroll min-h-[50vh] max-h-[50vh] ${compileError ? "text-red-500" : "text-white"}`}>
          <pre>{output}</pre>
        </div>
        <button
          onClick={() => { setOutput(""); setCompileError(false); }}
          className="text-sm font-semibold mt-2 bg-[#f5f2e9] py-2 px-2 border border-black hover:bg-gray-200 transition-all rounded"
        >
          Clear Output
        </button>
      </div>
    </div>
    </>
  );
};

export default CodeEditor;