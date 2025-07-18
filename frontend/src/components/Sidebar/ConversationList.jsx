import styles from "../../App.module.css";
import DropdownMenu from "../DropdownMenu";

function ConversationList({
  conversations,
  setConversations,
  currentChat,
  setCurrentChat,
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
}) {
  return (
    <div className={styles.conversationList}>
      {conversations.map((conv, index) => (
        <div
          key={index}
          className={styles.conversationItem}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {editingIndex === index ? (
            <input
              type="text"
              value={renameText}
              onChange={(e) => setRenameText(e.target.value)}
              onBlur={() => handleRename(index)}
              onKeyDown={(e) => e.key === "Enter" && handleRename(index)}
              autoFocus
              className={styles.renameInput}
            />
          ) : (
            <div className={styles.chatRow}>
              <span onClick={() => { setCurrentChat(conversations[index].messages);}}>
                {conv.name}
              </span>
              {hoverIndex === index && (
                <div
                  className={styles.menuIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenIndex(index === menuOpenIndex ? null : index);
                  }}
                >
                  ⋯
                </div>
              )}
              {menuOpenIndex === index && (
                <DropdownMenu
                  index={index}
                  menuOpenIndex={menuOpenIndex}
                  setMenuOpenIndex={setMenuOpenIndex}
                  setEditingIndex={setEditingIndex}
                  setRenameText={setRenameText}
                  setConversations={setConversations}
                  dropdownRef={dropdownRef}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ConversationList;