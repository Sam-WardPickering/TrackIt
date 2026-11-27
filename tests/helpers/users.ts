export function uniqueEmail(label: string): string {
    const random = Math.random().toString(36).slice(2, 8);
    return `e2e-${label}-${Date.now()}-${random}@trackit.test`;
}