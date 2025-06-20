
// Convierte una fecha de tipo '2025-02-06T09:13:02.924+00:00' a '6 Feb 2025'
export const formatDate = (inputDate : Date): string => {
  const date = new Date(inputDate);

  const day = date.getUTCDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

// Devuelve un array de string con el nombre de los últimos 6 meses
export const getUltimos6Meses = () : string[] => {
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const hoy = new Date();
  const resultado: string[] = [];

  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    resultado.push(meses[fecha.getMonth()]);
  }

  return resultado;
}
