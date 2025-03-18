export const getInitialLocale = () => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale');
      if (savedLocale) {
        return savedLocale;
      }
    }
    return 'en';
  };