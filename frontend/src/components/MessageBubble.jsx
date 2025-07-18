import styles from "../App.module.css";

function formatMarkdown(text) {
  return text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="bold-text">$1</strong>'
  );
}

function MessageBubble({ type, text }) {
  return (
    <div
      className={type === "user" ? styles.userBubble : styles.aiBubble}
    >
      <div
        dangerouslySetInnerHTML={{ __html: formatMarkdown(text) }}
      />
    </div>
  );
}

export default MessageBubble;