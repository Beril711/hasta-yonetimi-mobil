import * as SecureStore from 'expo-secure-store';

export const getToken = async () => {
  return await SecureStore.getItemAsync('access_token');
};

export const setToken = async (token) => {
  await SecureStore.setItemAsync('access_token', token);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync('access_token');
};

export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};