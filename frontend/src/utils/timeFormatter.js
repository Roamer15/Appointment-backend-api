export const formatTime = (timeString, includeSeconds = false) => {
  if (!timeString) return '';
  const parts = timeString.split(':');
  return includeSeconds ? timeString : `${parts[0]}:${parts[1]}`;
};