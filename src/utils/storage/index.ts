const storage = {
  set(key: string | null, value: any | null) {
    if (key && value)
      uni.setStorageSync(key, value);
  },
  get(key: string | null) {
    if (!key) return null;
    return uni.getStorageSync(key);
  },
  setJSON(key: string, value: any) {
    if (key && value)
      uni.setStorageSync(key, JSON.stringify(value));
  },
  getJSON(key: string) {
    const value = this.get(key);
    try {
      return JSON.parse(value);
    }
    catch {
      return value;
    }
  },
  remove(key: string) {
    uni.removeStorageSync(key);
  },
  clear() {
    uni.clearStorageSync();
  },
};

export default storage;
