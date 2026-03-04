import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper para parsear datas YYYY-MM-DD exatamente na meia noite local, evitando offset do Date()
export function parseLocalDate(dateStr: string | null | undefined): Date {
    if (!dateStr) return new Date();
    try {
        const [year, month, day] = dateStr.split('T')[0].split('-');
        if (!year || !month || !day) return new Date(dateStr);
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } catch {
        return new Date();
    }
}
