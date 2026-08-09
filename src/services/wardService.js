import api from "./api";

export async function listWards() {
  const { data } = await api.get("/wards");
  return data;
}
