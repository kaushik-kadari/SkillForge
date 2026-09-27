const config = require("../config/config");

/**
 * Free public runner via Wandbox (no API key / no billing).
 * https://github.com/melpon/wandbox
 *
 * Optional: if JUDGE0_API_KEY is set, Judge0 CE (RapidAPI) is used instead.
 */

const WANDBOX_COMPILERS = {
  javascript: "nodejs-20.17.0",
  python: "cpython-3.12.7",
  java: "openjdk-jdk-21+35",
  c: "gcc-13.2.0-c",
  cpp: "gcc-13.2.0",
  csharp: "mono-6.12.0.199",
  ruby: "ruby-3.3.11",
  // Swift compilers on Wandbox currently fail with container/runtime errors
  typescript: "typescript-5.6.2",
  go: "go-1.23.2",
  php: "php-8.3.12",
};

const JUDGE0_LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  c: 50,
  cpp: 54,
  csharp: 51,
  ruby: 72,
  swift: 83,
  typescript: 74,
  go: 60,
  kotlin: 78,
  php: 68,
};

/** Wandbox saves Java as prog.java — strip top-level `public class`. */
const prepareCodeForProvider = (provider, language, code) => {
  if (provider === "wandbox" && language === "java") {
    return code.replace(/\bpublic\s+class\s+/g, "class ");
  }
  return code;
};

const buildJudge0Output = (data) => {
  const parts = [];
  if (data.compile_output) parts.push(String(data.compile_output));
  if (data.stdout) parts.push(String(data.stdout));
  if (data.stderr) parts.push(String(data.stderr));
  if (data.message) parts.push(String(data.message));

  const text = parts.join("").trim();
  const statusId = data.status?.id;
  const isError = statusId !== undefined && statusId !== 3;

  return {
    output:
      text ||
      (data.status?.description ? `${data.status.description}` : "No output."),
    isError,
    status: data.status?.description || null,
    provider: "judge0",
  };
};

const buildWandboxOutput = (data) => {
  const parts = [];
  if (data.compiler_message) parts.push(String(data.compiler_message));
  if (data.program_message) parts.push(String(data.program_message));
  else {
    if (data.program_output) parts.push(String(data.program_output));
    if (data.program_error) parts.push(String(data.program_error));
  }

  const text = parts.join("").trim();
  const status = data.status;
  // status "0" = success; non-zero / signal = error
  const isError =
    (status !== undefined && status !== null && String(status) !== "0") ||
    Boolean(data.signal);

  return {
    output: text || (isError ? `Exited with status ${status}` : "No output."),
    isError,
    status: data.signal ? `Signal: ${data.signal}` : `Status: ${status}`,
    provider: "wandbox",
  };
};

const executeWithWandbox = async (language, code) => {
  const compiler = WANDBOX_COMPILERS[language];
  if (!compiler) {
    const err = new Error(
      language === "swift" || language === "kotlin"
        ? `${language === "swift" ? "Swift" : "Kotlin"} is not available on the free runner right now. Pick another language.`
        : `Unsupported language: ${language}`
    );
    err.status = 400;
    throw err;
  }

  const preparedCode = prepareCodeForProvider("wandbox", language, code);

  const response = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      compiler,
      code: preparedCode,
      stdin: "",
      save: false,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.message || `Wandbox request failed (${response.status})`);
    err.status = 502;
    throw err;
  }

  return buildWandboxOutput(data);
};

const executeWithJudge0 = async (language, code) => {
  const languageId = JUDGE0_LANGUAGE_IDS[language];
  if (!languageId) {
    const err = new Error(`Unsupported language: ${language}`);
    err.status = 400;
    throw err;
  }

  const apiKey = config.JUDGE0_API_KEY;
  const apiHost = config.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com";
  const apiUrl = (config.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com").replace(
    /\/$/,
    ""
  );

  const url = new URL(`${apiUrl}/submissions`);
  url.searchParams.set("base64_encoded", "false");
  url.searchParams.set("wait", "true");
  url.searchParams.set("fields", "*");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": apiHost,
    },
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin: "",
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data.message || data.error || `Judge0 request failed (${response.status})`;
    const err = new Error(String(message));
    err.status = response.status === 429 ? 429 : 502;
    throw err;
  }

  return buildJudge0Output(data);
};

exports.executeCode = async (req, res) => {
  const { language, code } = req.body;

  if (!language || typeof code !== "string") {
    return res.status(400).json({ error: "language and code are required" });
  }

  const useJudge0 = Boolean(config.JUDGE0_API_KEY);

  try {
    const result = useJudge0
      ? await executeWithJudge0(language, code)
      : await executeWithWandbox(language, code);
    return res.json(result);
  } catch (error) {
    console.error("Code execute error:", error.message || error);
    const status = error.status || 502;
    return res.status(status).json({
      error: error.message || "Failed to execute code",
    });
  }
};

exports.getSupportedLanguages = (_req, res) => {
  const useJudge0 = Boolean(config.JUDGE0_API_KEY);
  res.json({
    provider: useJudge0 ? "judge0-ce" : "wandbox",
    languages: useJudge0
      ? Object.keys(JUDGE0_LANGUAGE_IDS)
      : Object.keys(WANDBOX_COMPILERS),
  });
};
