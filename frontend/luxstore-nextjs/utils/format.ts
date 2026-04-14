
export function formatCategory(value: string) {
        return value
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase());
    }