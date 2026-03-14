
export const getFloatingValue = (value, decimal = 3) => {
    if (value === undefined || value === null || isNaN(value) || value === "" || value === 0 || value === "0" || Number(value) == 0) {
        return Number(0).toFixed(decimal);
    } else {
        return Number(value || 0)?.toFixed(decimal);
    }
};