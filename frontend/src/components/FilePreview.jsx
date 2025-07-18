import styles from "../App.module.css";

function FilePreview({ previewFileName, setFile, setPreviewFileName }) {
  if (!previewFileName) return null;

  return (
    <div className={styles.filePreview}>
      <span>📄 {previewFileName}</span>
      <button
        className={styles.removeFileButton}
        onClick={() => {
          setFile(null);
          setPreviewFileName("");
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default FilePreview;