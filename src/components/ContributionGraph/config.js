export const formatDateToString = (date) => {
  const originalDate = new Date(date);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return originalDate.toLocaleDateString("ru-RU", options);
};

export const formatDateToISO = (date) => {
  const originalDate = new Date(date);
  const year = originalDate.getFullYear();
  const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
  const day = originalDate.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getColorClass = (contributionCount) => {
  if (contributionCount === 0) {
    return "no-contribution";
  } else if (contributionCount >= 1 && contributionCount <= 9) {
    return "low-contribution";
  } else if (contributionCount >= 10 && contributionCount <= 19) {
    return "medium-contribution";
  } else if (contributionCount >= 20 && contributionCount <= 29) {
    return "high-contribution";
  } else {
    return "max-contribution";
  }
};
