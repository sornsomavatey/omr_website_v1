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
      desc: product.description || '',
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
      backgroundImage: "@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.webp"
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

export const getTestimonialsData = async () => {
  const response = await api.get('/mocks/testimonials.json');
  return response.data;
};

export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export const createReservation = async (reservationData: any) => {
  const response = await backendApi.post('/reservations/', reservationData);
  return response.data;
};

export const createEventBooking = async (eventBookingData: any) => {
  const response = await backendApi.post('/event-bookings/', eventBookingData);
  return response.data;
};

export default api;
