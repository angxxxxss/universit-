const defaultBase = "http://localhost:4000/api";

export const API_BASE = process.env.REACT_APP_API_URL || defaultBase;

export const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.error || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
};
