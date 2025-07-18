import styles from "../../App.module.css";

function ChatHeader() {
  return (
    <div className={styles.chatHeader}>
      <h1>AI Assistant Chat</h1>
      <p>Ask me anything or upload documents for analysis</p>
    </div>
  );
}

export default ChatHeader;
