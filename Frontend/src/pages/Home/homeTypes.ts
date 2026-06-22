export type SignatureDish = {
  nameKey: string;
  categoryKey: string;
  descKey: string;
  img: string;
  price: string;
  badgeKey: string;
};

export type DiningSpace = {
  nameKey: string;
  tagKey: string;
  descKey: string;
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
  dateKey: string;
  textKey: string;
  avatar: string;
};