export type SignatureDish = {
  name: string;
  category: string;
  desc: string;
  img: string;
  price: string;
  badge: string;
};

export type DiningSpace = {
  name: string;
  tag: string;
  desc: string;
  img: string;
};

export type Branch = {
  nameKey: string;
  addressKey: string;
  phone: string;
  hoursKey: string;
  img: string;
  tagKeys: string[];
};

export type Testimonial = {
  name: string;
  date: string;
  text: string;
  avatar: string;
};
