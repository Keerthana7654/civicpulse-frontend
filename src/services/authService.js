import api from "./api";

export async function login(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

export async function register(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
}
