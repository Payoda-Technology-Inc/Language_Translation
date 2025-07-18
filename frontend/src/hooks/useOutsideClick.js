// src/hooks/useOutsideClick.js
import { useEffect } from "react";

export default function useOutsideClick(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return;
    function handle(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    }
    document.addEventListener("mousedown", handle, true);
    return () => document.removeEventListener("mousedown", handle, true);
  }, [ref, handler, active]);
}
