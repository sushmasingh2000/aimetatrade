export const formatedDate = (m, date, type = null) => {
    if (!date) return "--";

    const dt = m.utc(date); 

    if (!type || type === "date_time") {
        return dt.format("DD-MM-YYYY HH:mm:ss");
    } else if (type === "date") {
        return dt.format("DD-MM-YYYY");
    } else if (type === "time") {
        return dt.format("HH:mm:ss");
    }
};