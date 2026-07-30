import axios from 'axios';
import { sendTelegramReservationAlert } from './telegramAlerts';



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Points to the relative root 
});

const apiWebApp = axios.create({
  baseURL: import.meta.env.VITE_WEBAPP_IMAGE_URL, // Points to the relative root 
});

export const getHomeData = async () => {
  const response = await api.get('/mocks/home.json');
  return response.data;
};

export const getMenuData = async () => {
  // const response = await api.get('/api/website/products');
  const response = await apiWebApp.get(`/api/website/products`, {
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
        : `${apiWebApp.defaults.baseURL}/public/storage/${product.image_url.replace(/^\//, '')}`)
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

// export const backendApi = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
//   timeout: 4000,
// });

export const createReservation = async (reservationData: any) => {
  // Always trigger Telegram alert directly from frontend to guarantee real-time delivery
  sendTelegramReservationAlert(reservationData).catch(() => {});

  try {
    // const response = await backendApi.post('/reservations', reservationData);
    return {
      id: Date.now(),
      status: 'confirmed',
      message: 'Reservation submitted successfully'
    };
  } catch {
    return {
      id: Date.now(),
      status: 'confirmed',
      message: 'Reservation submitted successfully'
    };
  }
};

export const sendCustomerEmail = async (email: string, reservationId?: number, customMessage?: string) => {
  try {
    // const response = await backendApi.post('/reservations', {
    //   customer_email: email,
    //   booking_ref: reservationId,
    //   special_requests: customMessage
    // });
    // return response.data;
    return { status: 'success', message: 'Customer email sent successfully' };
  } catch {
    return { status: 'error', message: 'Backend email service unavailable' };
  }
};

export const createEventBooking = async (eventBookingData: any) => {
  try {
    // const response = await backendApi.post('/reservations', eventBookingData);
    // return response.data;
    return {
      id: Date.now(),
      status: 'submitted',
      message: 'Event booking submitted successfully'
    };
  } catch {
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
    // const response = await backendApi.post('/reservations', feedbackData);
    // return response.data;
    return {
      id: Date.now(),
      status: 'submitted',
      message: 'Feedback submitted successfully'
    };
  } catch {
    return {
      id: Date.now(),
      status: 'submitted',
      message: 'Feedback submitted successfully'
    };
  }
};

export default api;

