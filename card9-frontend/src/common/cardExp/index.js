function addOneYear(date) {
  const oneYear = new Date(date);
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  return oneYear;
}

export const ExpDateChecker = (date) => {
  const currDate = new Date();
  const expDate = new Date(date);

  const difference = expDate.getTime() - currDate.getTime();
  const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
};

export const getDateOneYearLater = (date) => {
  if (date) {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    newDate.setFullYear(year);

    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const formattedYear = newDate.getFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${formattedYear}`;

    return formattedDate;
  } else {
    return null;
  }
};
