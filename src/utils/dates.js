 export const getWeekStartDateStr = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sunday
    d.setDate(d.getDate() - day);
    return d.toISOString().slice(0, 10);
  };