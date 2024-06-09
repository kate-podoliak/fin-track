import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import { Transaction } from "@/components/Main/Main";

export function formatDateToTime(dateString: string) {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

export function formatDateHeader(date: Date) {
    if (isToday(date)) {
        return 'Сьогодні';
    } else if (isYesterday(date)) {
        return 'Вчора';
    } else {
        return format(date, 'dd.MM');
    }
}

export function groupTransactionsByDate(transactions: Transaction[]): Record<string, Transaction[]> {
    const grouped: Record<string, Transaction[]> = {};
    transactions.forEach((transaction) => {
        const date = startOfDay(new Date(transaction.createdAt));
        const dateString = date.toISOString();

        if (!grouped[dateString]) {
            grouped[dateString] = [];
        }

        grouped[dateString].push(transaction);
    });
    return grouped;
}