// Helper to safely parse SQL date strings (YYYY-MM-DD HH:MM:SS)
const parseDate = (date: string | number | Date): Date => {

    if (date instanceof Date) return date;
    if (typeof date === 'number') return new Date(date);
    if (!date) return new Date();

    // Handle SQL format "YYYY-MM-DD HH:MM:SS" which Safari/others might dislike
    // Replace space with T to make it ISO-like
    if (typeof date === 'string' && date.includes(' ')) {
        return new Date(date.replace(' ', 'T'));
    }
    return new Date(date);
};

export const formatTime = (date?: string | number | Date): string => {
    if (!date) return '';
    return parseDate(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date?: string | number | Date): string => {
    if (!date) return '';
    const parsedDate = parseDate(date);
    if (isToday(parsedDate)) return 'Today';
    return parsedDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

export const isToday = (date: string | number | Date): boolean => {
    const d = parseDate(date);
    const today = new Date();
    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
};

export const formatDuration = (minutes: number): string => {
    if (!minutes && minutes !== 0) return '00:00:00';

    const totalSeconds = Math.floor(minutes * 60);
    let hours: string | number = Math.floor(totalSeconds / 3600);
    let mins: string | number = Math.floor((totalSeconds % 3600) / 60);
    let secs: string | number = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (secs > 0) parts.push(`${secs}s`);

    if (parts.length === 0) return '0m';
    return parts.join(' ');
};

export const formatTimer = (minutes: number): string => {
    if (!minutes && minutes !== 0) return '00:00:00';

    const totalSeconds = Math.floor(minutes * 60);
    let hours: string | number = Math.floor(totalSeconds / 3600);
    let mins: string | number = Math.floor((totalSeconds % 3600) / 60);
    let secs: string | number = totalSeconds % 60;

    hours = hours <= 0 ? '00' : (hours < 10 ? `0${hours}` : hours);
    mins = mins <= 0 ? '00' : (mins < 10 ? `0${mins}` : mins);
    secs = secs <= 0 ? '00' : (secs < 10 ? `0${secs}` : secs);

    return `${hours}:${mins}:${secs}`;
};
export const formatRelativeTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return formatDate(timestamp);
};
