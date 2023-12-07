export function getSpecialDatesFormatted() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Last day of the current month with maximum time
    let lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    const formattedLastDayOfCurrentMonth = formatDateToString(lastDayOfCurrentMonth);

    // First day of the month 5 months ago at the start of the day
    let firstDayOfSixMonthsAgo = new Date(currentYear, currentMonth - 5, 1);
    const formattedFirstDayOfSixMonthsAgo = formatDateToString(firstDayOfSixMonthsAgo);

    return {
        lastDayOfCurrentMonth: formattedLastDayOfCurrentMonth,
        firstDayOfSixMonthsAgo: formattedFirstDayOfSixMonthsAgo
    };
}

export function formatDateToString(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}