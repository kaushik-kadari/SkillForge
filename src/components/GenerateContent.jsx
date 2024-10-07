import Groq from "groq-sdk";
import { useState } from "react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./Content.css";


const GenerateContent = ({ topic }) => {
  const apiKey = "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";
  const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });
  const [content, setContent] = useState("");

  const generateContent = async () => {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Explain about ${topic} in Detailed Format. 
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
    setContent(response.choices[0].message.content);
    console.log(response);
  };

  useEffect(() => {
    generateContent();
  }, []);

  return (
    <div>
      <p>
        <ReactMarkdown breaks={true} className="markdown-body">{content}</ReactMarkdown>
      </p>
    </div>
  );
};

export default GenerateContent;
