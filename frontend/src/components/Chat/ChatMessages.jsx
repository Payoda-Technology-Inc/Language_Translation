import styles from "../../App.module.css";
import MessageBubble from "../MessageBubble";

function ChatMessages({ currentChat }) {
  return (
    <>
      {currentChat.map((msg, i) => (
        <MessageBubble
          key={i}
          type={msg.type}
          text={msg.text}
        />
      ))}
    </>
  );
}

export default ChatMessages;