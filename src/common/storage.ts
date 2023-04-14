const storage = {
  isSupported: typeof window["localStorage"] !== "undefined" && window["localStorage"] !== null,

  get: <T>(key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  set: (key: string, item: any) => {
    const value = JSON.stringify(item);
    localStorage.setItem(key, value);
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },
};

export default storage;
