// src/hooks/useChatApi.js
import { useState, useCallback } from "react";

export default function useChatApi() {
  const [conversations, setConversations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all chats and documents
  const loadData = useCallback(async () => {
    try {
      const chatsRes = await fetch("http://localhost:5000/api/chats");
      const savedChats = await chatsRes.json();
      setConversations(
        savedChats.map((chat) => ({
          name: chat.title,
          messages: chat.messages,
        }))
      );
      const docsRes = await fetch("http://localhost:5000/documents");
      const savedDocs = await docsRes.json();
      setDocuments(savedDocs);
    } catch (error) {
      console.error("Failed to load saved data:", error);
    }
  }, []);

  // Upload a file and get streaming AI response
  const uploadFileAndStream = async ({
    file,
    onUserMessage,
    onAIStream,
    onFinish,
    setDocumentsOnDone,
    setIsLoading,
    previewFileName,
  }) => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      if (onUserMessage) onUserMessage(`📄 Sent a file: ${previewFileName}`);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let resultText = "";
      if (onAIStream) onAIStream(""); // start AI message

      // Stream AI response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n").filter((line) => line.trim());
        for (const line of lines) {
          if (line === "data: [DONE]") {
            setIsLoading(false);
            // Refresh docs
            const docsRes = await fetch("http://localhost:5000/documents");
            const savedDocs = await docsRes.json();
            setDocumentsOnDone(savedDocs);
            if (onFinish) onFinish();
            return;
          }
          if (line.startsWith("data: ")) {
            const text = line.replace("data: ", "");
            resultText += text;
            if (onAIStream) onAIStream(resultText);
          }
        }
      }
    } catch (err) {
      alert("File upload failed!");
      setIsLoading(false);
    }
  };

  // Ask question with streaming
  const askStream = async ({
    questionToSend,
    onAIStream,
    onFinish,
    setIsLoading,
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/ask-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionToSend }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let resultText = "";
      if (onAIStream) onAIStream(""); // start AI message

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n").filter((line) => line.trim());
        for (const line of lines) {
          if (line === "data: [DONE]") {
            setIsLoading(false);
            if (onFinish) onFinish();
            return;
          }
          if (line.startsWith("data: ")) {
            const text = line.replace("data: ", "");
            resultText += text;
            if (onAIStream) onAIStream(resultText);
          }
        }
      }
    } catch (err) {
      alert("Streaming failed!");
      setIsLoading(false);
    }
  };

  // Generate title for a conversation
  const generateChatTitle = async (messages) => {
    try {
      const res = await fetch("http://localhost:5000/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.slice(0, 4) }),
      });
      const data = await res.json();
      return data.title;
    } catch (error) {
      return null;
    }
  };

  // Save chat
  const saveChat = async (title, messages) => {
    try {
      await fetch("http://localhost:5000/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, messages }),
      });
    } catch (error) {
      // handle error silently
    }
  };

  return {
    conversations,
    setConversations,
    documents,
    setDocuments,
    isLoading,
    setIsLoading,
    loadData,
    uploadFileAndStream,
    askStream,
    generateChatTitle,
    saveChat,
  };
}
