export function uniqueTitle(label: string): string {
    const random = Math.random().toString(36).slice(2, 8);
    return `E2E ${label} ${Date.now()}-${random}`;
}