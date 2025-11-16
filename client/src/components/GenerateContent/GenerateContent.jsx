import Groq from "groq-sdk";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { addContent, getContent } from "../../services/contentService";
import { FallingLines } from "react-loader-spinner";

const GenerateContent = ({ topic, subject }) => {
  const apiKey = import.meta.env.VITE_groqApiKey;
  const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

  const [content, setContent] = useState("");

  const generateContent = async () => {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Imagine you as a professional ${subject} teacher.
              Explain about ${topic} from ${subject} in Detail in 10000 words or more. 
              Guidelines for Generating PDF Content:
              Avoid including the main heading.
              Ensure the content is clear, concise, and formatted for easy readability.
              Maintain proper spacing between paragraphs for improved flow and visual appeal.
              Use bold, italic, and strikethrough formatting for emphasis and importance.
              Use headings for clarity and organization.
              Use bullet points, numbered lists, or subheadings where applicable to organize key information.
              Use proper grammar and spelling.
              Use proper capitalization and punctuation.
              Ensure no references or citations are included.
            `,
          },
        ],
        model: "llama-3.1-8b-instant",
      });

      const generatedContent = response.choices[0].message.content;
      setContent(generatedContent);
      return generatedContent; // Return generated content for use in other async functions
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
        const generatedContent = await generateContent();
        await addContentHandler(subject, subtopic, generatedContent);
      } else {
        // Other errors -> show error
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    getContentHandler(subject, topic);
  }, [subject, topic]);

  if (content == "") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-h-[60vh]">
        {/* <p className="text-3xl font-semibold my-4">
          Loading Content
        </p> */}
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
      <ReactMarkdown breaks={true} className="markdown-body">
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default GenerateContent;
