export const getTimeOfDay = (dateTime) => {
  if (!dateTime) return "";

  const date = new Date(dateTime);
  const hours = date.getHours();

  if (hours >= 5 && hours < 11) return "Buổi sáng";
  if (hours >= 11 && hours < 13) return "Buổi trưa";
  if (hours >= 13 && hours < 18) return "Buổi chiều";
  if (hours >= 18 || hours < 5) return "Buổi tối";
};
