
// Convierte una fecha de tipo '2025-02-06T09:13:02.924+00:00' a '6 Feb 2025'
export const formatDate = (inputDate : Date): string => {
  const date = new Date(inputDate);

  const day = date.getUTCDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}
