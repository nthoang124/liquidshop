export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "---";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "Ngày không hợp lệ";

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
