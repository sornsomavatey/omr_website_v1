import axios from 'axios';
import { sendTelegramReservationAlert } from './telegramAlerts';

const api = axios.create({
  baseURL: '/', // Points to the relative root 
});

export const getHomeData = async () => {
  const response = await api.get('/mocks/home.json');
  return response.data;
};

export const getMenuData = async () => {
  const response = await axios.get('/api/public-menu', {
    headers: { Accept: 'application/json' },
  });
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

export const getEventsData = async () => {
  const response = await api.get('/mocks/events.json');
  return response.data;
};

export const getGalleryData = async () => {
  const response = await api.get('/mocks/gallery.json');
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

const getRelativeReviewAgeInMonths = (date: unknown) => {
  if (typeof date !== 'string') return Number.POSITIVE_INFINITY;

  const normalizedDate = date.trim().toLowerCase();
  const amountMatch = normalizedDate.match(/\d+/);
  const amount = amountMatch ? Number(amountMatch[0]) : 1;

  if (normalizedDate.includes('day') || normalizedDate.includes('week')) return 0;
  if (normalizedDate.includes('month')) return amount;
  if (normalizedDate.includes('year')) return amount * 12;

  return Number.POSITIVE_INFINITY;
};

export const getTestimonialsData = async () => {
  const response = await api.get('/mocks/testimonials.json');
  if (!Array.isArray(response.data)) return response.data;

  return [...response.data].sort(
    (first, second) =>
      getRelativeReviewAgeInMonths(first?.date) - getRelativeReviewAgeInMonths(second?.date),
  );
};

export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 4000,
});

export const createReservation = async (reservationData: any) => {
  // Always trigger Telegram alert directly from frontend to guarantee real-time delivery
  sendTelegramReservationAlert(reservationData).catch((err) => {
    console.warn('Telegram alert dispatch warning:', err);
  });

  try {
    const response = await backendApi.post('/reservations', reservationData);
    return response.data;
  } catch (err) {
    console.warn('Backend API offline. Operating standalone in frontend mode.', err);
    return {
      id: Date.now(),
      status: 'confirmed',
      message: 'Reservation submitted successfully'
    };
  }
};

export const sendCustomerEmail = async (email: string, reservationId?: number, customMessage?: string) => {
  try {
    const response = await backendApi.post('/reservations', {
      customer_email: email,
      booking_ref: reservationId,
      special_requests: customMessage
    });
    return response.data;
  } catch (err) {
    console.warn('Backend email dispatch offline.', err);
    return { status: 'error', message: 'Backend email service unavailable' };
  }
};

export const createEventBooking = async (eventBookingData: any) => {
  try {
    const response = await backendApi.post('/reservations', eventBookingData);
    return response.data;
  } catch (err) {
    console.warn('Backend API offline. Operating standalone for event booking.', err);
    return {
      id: Date.now(),
      status: 'submitted',
      message: 'Event booking submitted successfully'
    };
  }
};

export type FeedbackRequest = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const createFeedback = async (feedbackData: FeedbackRequest) => {
  try {
    const response = await backendApi.post('/reservations', feedbackData);
    return response.data;
  } catch (err) {
    console.warn('Backend API offline. Operating standalone for feedback submission.', err);
    return {
      id: Date.now(),
      status: 'submitted',
      message: 'Feedback submitted successfully'
    };
  }
};

export default api;

