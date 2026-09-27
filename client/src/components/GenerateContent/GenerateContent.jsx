import Groq from "groq-sdk";
import { useState, useEffect } from "react";
import MarkdownContent from "../MarkdownContent/MarkdownContent";
import { addContent, getContent } from "../../services/contentService";
import { FallingLines } from "react-loader-spinner";

const GenerateContent = ({ topic, subject }) => {
  const apiKey = import.meta.env.VITE_groqApiKey;
  const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const generateContent = async () => {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Imagine you as a professional ${subject} teacher.
              Explain ${topic} from ${subject} in clear detail (about 500–700 words).
              Guidelines:
              Avoid including the main heading.
              Ensure the content is clear, concise, and easy to read.
              Maintain proper spacing between paragraphs.
              Use bold, italic, and strikethrough for emphasis where useful.
              Use headings for clarity and organization.
              Use bullet points, numbered lists, or subheadings where applicable.
              Use proper grammar, spelling, capitalization, and punctuation.
              Do not include references or citations.
            `,
          },
        ],
        model: "qwen/qwen3.8-27b",
        // Groq free tier OTPM is 1000 for this model — keep under the cap
        max_tokens: 900,
        temperature: 0.6,
      });

      const generatedContent = response.choices[0].message.content;
      setContent(generatedContent);
      setError("");
      return generatedContent;
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  };

  const addContentHandler = async (subject, subtopic, content) => {
    try {
      const response = await addContent(subject, subtopic, content);
      console.log("addContentHandler");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getContentHandler = async (subject, subtopic) => {
    try {
      const response = await getContent(subject, subtopic);
      setContent(response.content);
      console.log("getContentHandler");
      console.log(response);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // 404 -> generate content
        try {
          const generatedContent = await generateContent();
          await addContentHandler(subject, subtopic, generatedContent);
        } catch (genError) {
          const msg =
            genError?.status === 429 || genError?.message?.includes("429")
              ? "AI rate limit reached. Please wait a minute and refresh to try again."
              : "Failed to generate content. Please refresh and try again.";
          setError(msg);
        }
      } else {
        // Other errors -> show error
        console.error("Unexpected error:", error);
        setError("Failed to load content. Please try again.");
      }
    }
  };

  useEffect(() => {
    getContentHandler(subject, topic);
  }, [subject, topic]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] px-4 text-center">
        <p className="text-base text-gray-700 font-medium">{error}</p>
      </div>
    );
  }

  if (content == "") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-h-[60vh]">
        <FallingLines
          color="black"
          width="150"
          visible={true}
          ariaLabel="falling-circles-loading"
        />
        <p className="text-base text-gray-500 font-light my-4">
          Loading Content...
        </p>
      </div>
    );
  }

  return (
    <div>
      <MarkdownContent>{content}</MarkdownContent>
    </div>
  );
};

export default GenerateContent;
