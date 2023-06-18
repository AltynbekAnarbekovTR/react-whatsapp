export const getTime = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}`;
  return formattedTime;
};
