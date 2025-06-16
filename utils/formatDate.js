const formatDate = (inputDate) => {
  if (!inputDate) return ""; // Handle null/undefined cases

  const date = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn("Invalid date provided to formatDate:", inputDate);
    return "";
  }

  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-based
  const year = date.getFullYear();

  // Pad single digit day/month with leading zero for consistent formatting
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
};

export default formatDate;
