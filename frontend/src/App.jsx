import { useState, useEffect, useRef } from "react";
import styles from "./App.module.css";
import { Paperclip, ChevronLeft, ChevronRight } from "lucide-react";

import Sidebar from "./components/Sidebar/Sidebar";
import ChatMessages from "./components/Chat/ChatMessages";
import ChatHeader from "./components/Chat/ChatHeader";
import ChatInput from "./components/Chat/ChatInput";
import FilePreview from "./components/FilePreview";
import DropdownMenu from "./components/DropdownMenu";


function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const dropdownRef = useRef(null);

  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const documentsBtnRef = useRef(null);
  const documentsPopupRef = useRef(null);
  const [currentChat, setCurrentChat] = useState([]);

  const [conversations, setConversations] = useState([]);
  const [previewFileName, setPreviewFileName] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [renameText, setRenameText] = useState("");

  const [hoverIndex, setHoverIndex] = useState(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);

  const [documents, setDocuments] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function loadData() {
      try {
        // fetch chats
        const chatsRes = await fetch("http://localhost:5000/api/chats");
        const savedChats = await chatsRes.json();
        setConversations(
          savedChats.map((chat) => ({
            name: chat.title,
            messages: chat.messages,
          }))
        );

        // fetch documents
        const docsRes = await fetch("http://localhost:5000/documents");
        const savedDocs = await docsRes.json();
        setDocuments(savedDocs);
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpenIndex(null);
      }
    };

    if (menuOpenIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenIndex]);

  const handleAskStream = async (questionToSend) => {
    try {
      const res = await fetch("http://localhost:5000/ask-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionToSend }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let resultText = "";

      setCurrentChat((prev) => [...prev, { type: "ai", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line === "data: [DONE]") {
            setIsLoading(false);
            return;
          }

          if (line.startsWith("data: ")) {
            const text = line.replace("data: ", "");
            resultText += text;

            setCurrentChat((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { type: "ai", text: resultText };
              return updated;
            });
          }
        }
      }
    } catch (err) {
      console.error("Streaming failed:", err);
      alert("Streaming failed!");
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    const hasFile = !!file;
    const hasQuestion = question.trim() !== "";

    if (!hasFile && !hasQuestion) {
      return alert("Type a message or attach a file!");
    }

    if (hasFile) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      const currentFileName = previewFileName;
      setFile(null);
      setPreviewFileName("");

      setCurrentChat((prev) => [
        ...prev,
        { type: "user", text: `📄 Sent a file: ${currentFileName}` },
      ]);

      try {
        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let resultText = "";

        setCurrentChat((prev) => [...prev, { type: "ai", text: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n").filter((line) => line.trim());

          for (const line of lines) {
            if (line === "data: [DONE]") {
              setIsLoading(false);

              const docsRes = await fetch("http://localhost:5000/documents");
              const savedDocs = await docsRes.json();
              setDocuments(savedDocs);

              return;
            }

            if (line.startsWith("data: ")) {
              const text = line.replace("data: ", "");
              resultText += text;

              setCurrentChat((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { type: "ai", text: resultText };
                return updated;
              });
            }
          }
        }
      } catch (err) {
        console.error("File upload failed:", err);
        alert("File upload failed!");
        setIsLoading(false);
      }
    }

    if (hasQuestion) {
      setCurrentChat((prev) => [...prev, { type: "user", text: question }]);
      const q = question;
      setQuestion("");

      try {
        await handleAskStream(q);
      } catch (err) {
        console.error(err);
        alert("Question failed!");
        setIsLoading(false);
      }
    }
  };

  const handleRename = (index) => {
    setConversations((prev) => {
      const updated = [...prev];
      updated[index].name = renameText.trim() || updated[index].name;
      return updated;
    });
    setEditingIndex(null);
    setRenameText("");
  };

  return (
    <div className={styles.appWrapper}>
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        documents={documents}
        conversations={conversations}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        isDocumentsOpen={isDocumentsOpen}
        setIsDocumentsOpen={setIsDocumentsOpen}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        renameText={renameText}
        setRenameText={setRenameText}
        hoverIndex={hoverIndex}
        setHoverIndex={setHoverIndex}
        menuOpenIndex={menuOpenIndex}
        setMenuOpenIndex={setMenuOpenIndex}
        handleRename={handleRename}
        dropdownRef={dropdownRef}
        setConversations={setConversations}
      />

      {/* Main Chat Area */}
      <div
        className={`${styles.chatMain} ${
          !isSidebarOpen ? styles.chatExpanded : ""
        }`}
      >
        {/* Header */}
        <ChatHeader />

        {/* Chat Messages - Scrollable Area */}
        <div className={styles.chatMessagesContainer}>
          <div className={styles.chatMessages}>
            <ChatMessages currentChat={currentChat} />
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput
          question={question}
          setQuestion={setQuestion}
          isLoading={isLoading}
          handleSend={handleSend}
          file={file}
          setFile={setFile}
          previewFileName={previewFileName}
          setPreviewFileName={setPreviewFileName}
        />
      </div>
    </div>
  );
}

export default App;
