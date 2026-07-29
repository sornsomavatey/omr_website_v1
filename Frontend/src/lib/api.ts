import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Points to the relative root 
});

export const getHomeData = async () => {
  const response = await api.get('/mocks/home.json');
  return response.data;
};

export const getMenuData = async () => {
  const webappImageUrl = import.meta.env.VITE_WEBAPP_IMAGE_URL || 'https://omd.a2hosted.com';
  const baseUrl = webappImageUrl.endsWith('/') ? webappImageUrl : `${webappImageUrl}/`;
  
  const response = await axios.get(`${baseUrl}api/website/products`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  const products = response.data.data || [];

  const items: Record<string, any[]> = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Dessert: [],
    Drinks: [],
  };

  products.forEach((product: any) => {
    const categoryIds = (product.categories || []).map((cat: any) => Number(cat.id));
    const cleanImageUrl = product.image_url
      ? (product.image_url.startsWith('http')
        ? product.image_url
        : `${baseUrl}public/storage/${product.image_url.replace(/^\//, '')}`)
      : '';

    const item = {
      id: product.id,
      name: product.name,
      name_kh: product.name_kh,
      price: product.price ? `USD ${parseFloat(product.price).toFixed(2)}` : '',
      desc: (product.description && product.description !== 'NULL' && product.description !== 'null') ? product.description : '',
      img: cleanImageUrl,
      badge: (product.is_out_of_stock === '1' || (product.menu_out_of_stock && product.menu_out_of_stock.length > 0)) ? 'Out of Stock' : undefined,
    };

    if (categoryIds.includes(10)) {
      items.Breakfast.push({ ...item, category: 'BREAKFAST' });
    }
    if (categoryIds.includes(11)) {
      items.Lunch.push({ ...item, category: 'LUNCH' });
    }
    if (categoryIds.includes(12)) {
      items.Dinner.push({ ...item, category: 'DINNER' });
    }
    if (categoryIds.includes(17)) {
      items.Dessert.push({ ...item, category: 'DESSERT' });
    }
    if (categoryIds.includes(15)) {
      items.Drinks.push({ ...item, category: 'DRINKS' });
    }
  });

  return {
    hero: {
      title: "Our Menu",
      subtitle: "Traditional Cambodian flavors served with modern warmth and refined presentation.",
      backgroundImage: "@/assets/home-v2/boeung-kak-exterior.webp"
    },
    categories: ["Breakfast", "Lunch", "Dinner", "Dessert", "Drinks"],
    items
  };
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
  sendFrontendReservationAlert, 
  sendFrontendEventAlert, 
  sendFrontendFeedbackAlert 
} from './telegramAlerts';
import { 
  sendFrontendCustomerEmail, 
  sendFrontendEventEmail, 
  sendFrontendFeedbackEmail 
} from './emailAlerts';

export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 4000,
});

export const createReservation = async (reservationData: any) => {
  // Fire direct frontend alerts as primary or parallel dispatch
  sendFrontendReservationAlert(reservationData).catch(console.error);
  sendFrontendCustomerEmail({ reservationData }).catch(console.error);

  try {
    const response = await backendApi.post('/reservations/', reservationData);
    return response.data;
  } catch (err) {
    console.warn('Backend API offline. Operating standalone in frontend mode.', err);
    return {
      id: Date.now(),
      status: 'confirmed',
      booking_ref: `OMR-${Math.floor(100000 + Math.random() * 900000)}`,
      message: 'Reservation submitted successfully (Frontend Standalone Mode)'
    };
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
    console.warn('Backend email dispatch offline. Fallback to direct frontend email dispatch.', err);
    return sendFrontendCustomerEmail({
      email,
      message: customMessage,
      reservationId: reservationId || 'RES'
    });
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

