import React from "react";
import styles from "../App.module.css";

function DropdownMenu({
  index,
  menuOpenIndex,
  setMenuOpenIndex,
  setEditingIndex,
  setRenameText,
  setConversations,
  dropdownRef
}) {
  const handleRenameClick = () => {
    setEditingIndex(index);
    setRenameText(conv.name);
    setMenuOpenIndex(null);
  };

  const handleDeleteClick = () => {
    setConversations((prev) => prev.filter((_, i) => i !== index));
    setMenuOpenIndex(null);
  };

  return (
    <>
        <div ref={dropdownRef} className={styles.dropdownMenu}>
          <div onClick={handleRenameClick}>Rename</div>
          <div onClick={handleDeleteClick}>Delete</div>
        </div>
    </>
  );
}

export default DropdownMenu;
