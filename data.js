
function getDate(date) {
    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        timezone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
    
    };
    return new Date(date).toLocaleString("ru-RU", options).replace(",", "");
}

export { getDate }; // import пишем в начале кода а export в конец.