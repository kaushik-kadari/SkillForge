import Groq from "groq-sdk";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { addContent, getContent } from "../services/contentService";
import "./Content.css";

const GenerateContent = ({ topic, subject }) => {
  const apiKey = "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";
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
        model: "llama3-8b-8192",
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
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getContentHandler = async (subject, subtopic) => {
    try {
      const response = await getContent(subject, subtopic);

      if (response.status === 404) {
        // If 404, generate content and then add it to the database
        const generatedContent = await generateContent();
        await addContentHandler(subject, subtopic, generatedContent); // Only call addContentHandler after content is generated
      } else {
        setContent(response.content);
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getContentHandler(subject, topic);
  }, [subject, topic]);

  return (
    <div>
      <ReactMarkdown breaks={true} className="markdown-body">
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default GenerateContent;