// components/Sidebar/DocumentList.jsx
import styles from "../../App.module.css";
import { forwardRef } from "react";

const DocumentList = forwardRef(({ documents }, ref) => {
  return (
    <div ref={ref} className={styles.documentsPopup}>
      {documents.length === 0 ? (
        <div className={styles.navItem}>No files uploaded</div>
      ) : (
        documents.map((doc, idx) => (
          <div key={idx} className={styles.navItem}>
            📄 {doc.name}
          </div>
        ))
      )}
    </div>
  );
});

export default DocumentList;
