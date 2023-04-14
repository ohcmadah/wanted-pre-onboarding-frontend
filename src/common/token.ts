import storage from "./storage";

const KEY = "access_token";

const token = {
  get: () => {
    if (storage.isSupported) {
      const token = storage.get<string>(KEY);
      return token;
    }
  },

  set: (token: string) => {
    if (storage.isSupported) {
      storage.set(KEY, token);
    }
  },
};

export default token;
