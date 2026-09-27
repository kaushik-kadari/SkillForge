import { useState, useEffect } from "react";
import MarkdownContent from "../MarkdownContent/MarkdownContent";
import {
  addContent,
  getContent,
  generateContent as generateContentApi,
} from "../../services/contentService";
import { FallingLines } from "react-loader-spinner";

const GenerateContent = ({ topic, subject }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const generateContent = async () => {
    const response = await generateContentApi(subject, topic);
    const generatedContent = response.content;
    setContent(generatedContent);
    setError("");
    return generatedContent;
  };

  const addContentHandler = async (subject, subtopic, content) => {
    await addContent(subject, subtopic, content);
  };

  const getContentHandler = async (subject, subtopic) => {
    try {
      const response = await getContent(subject, subtopic);
      setContent(response.content);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          const generatedContent = await generateContent();
          await addContentHandler(subject, subtopic, generatedContent);
        } catch (genError) {
          const status = genError?.response?.status;
          const msg =
            status === 429
              ? "AI rate limit reached. Please wait a minute and refresh to try again."
              : "Failed to generate content. Please refresh and try again.";
          setError(msg);
        }
      } else {
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
