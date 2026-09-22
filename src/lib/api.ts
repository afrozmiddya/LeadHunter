import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const searchLeads = async (params: any) => {
  const res = await api.post('/search', params);
  return res.data;
};

export const saveLead = async (id: string, leadData: any) => {
  const res = await api.post(`/leads/${id}/save`, leadData);
  return res.data;
};

export const getSavedLeads = async () => {
  const res = await api.get('/leads/saved');
  return res.data.results;
};

export const exportLeadsCsv = async (leads: any[]) => {
  const res = await api.post('/leads/export', { leads }, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'leadhunter-leads.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
