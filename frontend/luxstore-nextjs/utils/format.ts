
export function formatCategory(value: any) {
    if (!value) return "";

    // se vier objeto (novo modelo)
    if (typeof value === "object") {
        return value.name;
    }

    // se ainda vier string (compatibilidade)
    return value
        .replace("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

