export function normalizeText(text: any) {
  if (!text) return "";

  // 🔥 se for objeto (ex: category)
  if (typeof text === "object") {
    text = text.name || "";
  }

  // 🔥 garantir que é string
  text = String(text);

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
