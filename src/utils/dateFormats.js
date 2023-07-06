const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    locale: 'fr-FR',
    timeZone: 'Europe/Paris',
    localeMatcher: 'best fit',
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const formatTime = (dateString) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    locale: 'fr-FR',
    timeZone: 'Europe/Paris',
    localeMatcher: 'best fit',
  };
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, options);
};

export { formatDate, formatTime };
