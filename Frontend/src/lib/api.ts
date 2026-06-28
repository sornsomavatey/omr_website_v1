import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Points to the relative root 
});

export const getHomeData = async () => {
  const response = await api.get('/mocks/home.json');
  return response.data;
};

export const getMenuData = async () => {
  const response = await api.get('/mocks/menu.json');
  return response.data;
};

export const getAboutData = async () => {
  const response = await api.get('/mocks/about.json');
  return response.data;
};

export const getCareersData = async () => {
  const response = await api.get('/mocks/careers.json');
  return response.data;
};

export const getGalleryData = async () => {
  const response = await api.get('/mocks/gallery.json');
  return response.data;
};

export const getEventsData = async () => {
  const response = await api.get('/mocks/events.json');
  return response.data;
};

export const getRestaurantsData = async () => {
  const response = await api.get('/mocks/restaurants.json');
  return response.data;
};

export const getReservationsData = async () => {
  const response = await api.get('/mocks/reservations.json');
  return response.data;
};

// Target FastAPI backend for dynamic API requests (e.g. creating reservations)
export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export const createReservation = async (reservationData: any) => {
  const response = await backendApi.post('/reservations/', reservationData);
  return response.data;
};

export default api;
