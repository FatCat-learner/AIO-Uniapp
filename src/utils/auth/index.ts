import storage from '@/utils/storage';

export const TokenKey: string = 'token';
export const TokenType = 'tokenType';
export const RefreshTokenKey: string = 'refresh_token';

export const getTokenType = (): string => {
  return storage.get(TokenType);
};

export const getToken = (): string => {
  return storage.get(TokenKey);
};

export const getRefreshToken = (): string => {
  return storage.get(RefreshTokenKey);
};

export const setTokenType = (value: string): void => {
  storage.set(TokenType, value);
};

export const setToken = (value: string): void => {
  storage.set(TokenKey, value);
};

export const setRefreshToken = (value: string): void => {
  storage.set(RefreshTokenKey, value);
};

export const removeTokenType = (): void => {
  storage.remove(TokenType);
};

export const removeToken = (): void => {
  storage.remove(TokenKey);
};

export const removeRefreshToken = (): void => {
  storage.remove(RefreshTokenKey);
};
