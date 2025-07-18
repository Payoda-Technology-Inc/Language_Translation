import { Paperclip } from "lucide-react";
import styles from "../../App.module.css";
import FilePreview from "../FilePreview";

function ChatInput({
  question,
  setQuestion,
  isLoading,
  handleSend,
  file,
  setFile,
  previewFileName,
  setPreviewFileName,
}) {
  return (
    <div className={styles.chatInputContainer}>
      {/* File Preview */}
      <FilePreview 
        previewFileName={previewFileName}
        setFile={setFile}
        setPreviewFileName={setPreviewFileName}
      />

      {/* Input Row */}
      <div className={styles.chatInputWrapper}>
        <label className={styles.attachmentIcon}>
          <Paperclip size={20} />
          <input
            type="file"
            accept=".txt,.pdf"
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected) {
                setFile(selected);
                setPreviewFileName(selected.name);
                e.target.value = null;
              }
            }}
            className={styles.hiddenInput}
          />
        </label>

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your message..."
          className={styles.questionInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
        />

        <button
          className={styles.askButton}
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;