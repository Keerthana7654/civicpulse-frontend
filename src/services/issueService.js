import api from "./api";

export async function createIssue(payload) {
  const { data } = await api.post("/issues", payload);
  return data;
}

export async function listIssues(wardId) {
  const { data } = await api.get("/issues", { params: wardId ? { wardId } : {} });
  return data;
}

export async function myIssues() {
  const { data } = await api.get("/issues/mine");
  return data;
}

export async function getIssue(id) {
  const { data } = await api.get(`/issues/${id}`);
  return data;
}

export async function confirmIssue(id) {
  const { data } = await api.post(`/issues/${id}/confirm`);
  return data;
}

export async function updateStatus(id, status, note) {
  const { data } = await api.patch(`/issues/${id}/status`, { status, note });
  return data;
}

export async function wardAnalytics(wardId) {
  const { data } = await api.get(`/analytics/ward/${wardId}`);
  return data;
}
