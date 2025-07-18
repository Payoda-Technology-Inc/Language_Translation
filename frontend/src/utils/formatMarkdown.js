export function formatMarkdown(text) {
  if (!text) return "";

  return text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="bold-text">$1</strong>'
  );

  // You can add more rules here in future
}
