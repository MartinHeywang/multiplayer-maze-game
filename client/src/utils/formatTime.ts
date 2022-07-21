function padded(input: number | string) {
    return input.toString().padStart(2, "0");
}

export function formatHour(time: Date) {
    return `${padded(time.getHours())}h${padded(time.getMinutes())}`;
}

export function formatDate(date: Date, options = { includeYear: true }) {
    return `${padded(date.getDate())}/${padded(date.getMonth() + 1)}${
        options.includeYear ? `/${date.getFullYear()}` : ""
    }`;
}

export function formatDuration(millis: number) {
    const seconds = Math.abs(Math.floor(millis / 1000));

    const minutes = Math.floor(seconds / 60);
    const secondsLeftover = seconds - minutes * 60;

    const hours = Math.floor(minutes / 60);
    const minutesLeftover = minutes - hours * 60;

    const formatted = `${millis < 0 ? "-" : ""}${hours}h ${minutesLeftover}m ${secondsLeftover}s`;

    return formatted;
}
