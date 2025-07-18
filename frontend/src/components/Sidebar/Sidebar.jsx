import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../App.module.css";
import ConversationList from "./ConversationList";
import DocumentList from "./DocumentList";

function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  documents,
  conversations,
  currentChat,
  setCurrentChat,
  isDocumentsOpen,
  setIsDocumentsOpen,
  editingIndex,
  setEditingIndex,
  renameText,
  setRenameText,
  hoverIndex,
  setHoverIndex,
  menuOpenIndex,
  setMenuOpenIndex,
  handleRename,
  dropdownRef,
  setConversations,
}) {
  const documentsBtnRef = useRef(null);
  const documentsPopupRef = useRef(null);

  return (
    <div
      className={`${styles.sidebar} ${
        !isSidebarOpen ? styles.sidebarClosed : ""
      }`}
    >
      <div className={styles.sidebarHeader}>
        {isSidebarOpen && <h2 className={styles.logo}>AI Assistant</h2>}
        <button
          className={styles.toggleBtn}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      </div>

      {isSidebarOpen && (
        <div className={styles.sidebarContent}>
          <div className={styles.nav}>
            <div
              className={styles.navItemActive}
              onClick={async () => {
                if (currentChat.length > 0) {
                  try {
                    const res = await fetch(
                      "http://localhost:5000/generate-title",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          messages: currentChat.slice(0, 4),
                        }),
                      }
                    );

                    const data = await res.json();
                    const generatedTitle =
                      data.title || `Chat ${conversations.length + 1}`;

                    setConversations((prev) => [
                      {
                        name: generatedTitle,
                        messages: currentChat,
                      },
                      ...prev,
                    ]);

                    await fetch("http://localhost:5000/api/save-chat", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        title: generatedTitle,
                        messages: currentChat,
                      }),
                    });
                  } catch (error) {
                    console.error("Title generation failed:", error);
                    setConversations((prev) => [
                      {
                        name: `Chat ${conversations.length + 1}`,
                        messages: currentChat,
                      },
                      ...prev,
                    ]);
                  }
                }

                setCurrentChat([]);
              }}
            >
              New Chat
            </div>

            <div
              ref={documentsBtnRef}
              className={styles.navItemActive}
              style={{
                marginBottom: "1rem",
                background: isDocumentsOpen ? "#407af6" : undefined,
              }}
              onClick={() => setIsDocumentsOpen((prev) => !prev)}
            >
              Documents
            </div>

            {isDocumentsOpen && (
              <DocumentList ref={documentsPopupRef} documents={documents} />
            )}

            <div className={styles.navItemTitle}>Past Conversations</div>
            <ConversationList
              conversations={conversations}
              setConversations={setConversations}
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
