import axios from 'axios'
const baseURL = (import.meta as any).env.VITE_API_BASE_URL || (window as any).__API__ || 'http://localhost:5000/api/v1'
export const api = axios.create({ baseURL })
