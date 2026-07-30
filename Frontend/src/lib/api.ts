import axios from 'axios';

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

import { 
  sendFrontendEventAlert, 
  sendFrontendFeedbackAlert 
} from './telegramAlerts';
import { 
  sendFrontendEventEmail, 
  sendFrontendFeedbackEmail 
} from './emailAlerts';

export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 4000,
});

export const createReservation = async (reservationData: unknown) => {
  try {
    const response = await backendApi.post('/reservations/', reservationData, {
      headers: {
        'Idempotency-Key': crypto.randomUUID(),
      },
    });

    if (!response.data?.id) {
      throw new Error('Reservation server returned an invalid response.');
    }

    return response.data;
  } catch (error) {
    console.error('Reservation submission failed.');

    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.detail;
      throw new Error(
        typeof serverMessage === 'string'
          ? serverMessage
          : 'We could not save your reservation. Please try again.',
      );
    }

    throw error;
  }
};

export const sendCustomerEmail = async (email: string, reservationId?: number, customMessage?: string) => {
  try {
    const response = await backendApi.post('/reservations/send-customer-email', {
      email,
      reservation_id: reservationId,
      custom_message: customMessage
    });
    return response.data;
  } catch (err) {
    console.error('Backend email dispatch failed.');
    throw err;
  }
};

export const createEventBooking = async (eventBookingData: any) => {
  sendFrontendEventAlert(eventBookingData).catch(console.error);
  sendFrontendEventEmail(eventBookingData).catch(console.error);

  try {
    const response = await backendApi.post('/event-bookings/', eventBookingData);
    return response.data;
  } catch (err) {
    console.warn('Backend API offline. Operating standalone for event booking.', err);
    return {
      id: Date.now(),
      status: 'submitted',
      message: 'Event booking submitted successfully (Frontend Standalone Mode)'
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
  sendFrontendFeedbackAlert(feedbackData).catch(console.error);
  sendFrontendFeedbackEmail(feedbackData).catch(console.error);

  try {
    const response = await backendApi.post('/contact/', feedbackData);
    return response.data;
  } catch (err) {
    console.warn('Backend API offline. Operating standalone for feedback submission.', err);
    return {
      id: Date.now(),
      status: 'submitted',
      message: 'Feedback submitted successfully (Frontend Standalone Mode)'
    };
  }
};

export default api;

