export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

// IMPROVED AUTH CHECK
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Basic format check (JWTs have 3 parts separated by dots)
    return token.split('.').length === 3;
  } catch (e) {
    return false;
  }
};