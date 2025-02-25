import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const languages = {
  javascript: { id: 63, comment: "// Write your JavaScript code here..." },
  python: { id: 71, comment: "# Write your Python code here..." },
  java: { id: 62, comment: "// Write your Java code here...\n// Make sure the class name is Main" },
  c: { id: 50, comment: "// Write your C code here..." },
  cpp: { id: 54, comment: "// Write your C++ code here..." },
  csharp: { id: 51, comment: "// Write your C# code here..." },
  ruby: { id: 72, comment: "# Write your Ruby code here..." },
  swift: { id: 83, comment: "// Write your Swift code here..." },
  typescript: { id: 74, comment: "// Write your TypeScript code here..." },
  go: { id: 60, comment: "// Write your Go code here..." },
  // kotlin: { id: 78, comment: "// Write your Kotlin code here..." },
  php: { id: 68, comment: "<?php\n// Write your PHP code here...\n\n?>" },
};

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [compileError, setCompileError] = useState(false);

  // Load saved code from sessionStorage
  useEffect(() => {
    const savedCode = sessionStorage.getItem(`code-${language}`);
    setCode(savedCode || languages[language].comment);
  }, [language]);

  // Save code to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem(`code-${language}`, code);
  }, [code, language]);

  const handleRun = async () => {
    try {
      setOutput("Running code...");
      setCompileError("");

      const submissionResponse = await axios.post(
        "https://judge029.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languages[language].id,
          stdin: "",
        },
        {
          headers: {
            "x-rapidapi-key": "167e7b0faemsh91c7410d23428ecp11ef13jsnbaae950a6483",
            "x-rapidapi-host": "judge029.p.rapidapi.com",
          },
        }
      );

      const token = submissionResponse.data.token;
      console.log("Submission Token:", token);

      setTimeout(async () => {
        try {
          const result = await axios.get(
            `https://judge029.p.rapidapi.com/submissions/${token}?base64_encoded=false&wait=true`,
            {
              headers: {
                "x-rapidapi-key": "167e7b0faemsh91c7410d23428ecp11ef13jsnbaae950a6483",
                "x-rapidapi-host": "judge029.p.rapidapi.com",
              },
            }
          );

          console.log("Execution Result:", result.data);

          setOutput(result.data.stdout || result.data.stderr || "No output");
        } catch (fetchError) {
          console.error("Error fetching result:", fetchError);
          setCompileError(true);
          setOutput("Failed to fetch execution result.");
        }
      }, 3000);
    } catch (error) {
      console.error("Execution Error:", error);
      setCompileError(true);
      setOutput("Failed to run code.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const clearEditor = () => {
    setCode(languages[language].comment);
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
    <div className="p-5">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-5 text-center">Code Editor</h1>
      {/* Language Selector */}
      <select
        className="p-2 border rounded bg-[#f5f2e9]"
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
          height="300px"
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

      {/* Output & Error Display */}
      {compileError ? (
        <div className="mt-4 p-3 bg-red-800 text-white rounded overflow-x-scroll">
          <h3>Error:</h3>
          <pre>{output}</pre>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-gray-800 text-white rounded overflow-x-scroll">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;