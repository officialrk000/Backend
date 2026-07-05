export const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return as is if invalid
    
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date).replace(/ /g, '/'); // Convert spaces to slashes if needed, or keep as is. User asked for dd/mmm/yyyy
  } catch (e) {
    return dateString;
  }
};
