export interface IOrder {
  id: number;
  user_id: number;
  amount: number;
  razor_pay_id: string;
  created_ts: string;
  last_updated_ts: string;
  status: number;
  delivery_fee: number;
  total_amount: number;
  address?: null;
  delivery_fee_paid: number;
  refund: number;
  used_ra_money: number;
  code_applied?: null;
  code_discount_amount?: null;
  code_discount_percent?: null;
  amount_paid?: null;
  razorpay_order_id?: null;
  razorpay_signature?: null;
  start_date?: Date;
  end_date?: Date;
  user: IUser;
  stage: number;
  items?: (IOrderItem)[] | null;
  delivery?: IDelivery;
  pickup?: IDelivery;
  isPaid(): boolean
}
export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email_address: string;
  phone: string;
  profile_pic: string;
  short_code?: null;
  alternate_phone: string;
  created_ts: string;
  address_id: number;
  bio: string;
  city: string;
  percentage: number;
  verified: boolean;
  address?: Location[];
  role: string;
}

export interface IBrand {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_ts: Date;
}
export interface IOrderItem {
  id: number;
  request_user_id: number;
  owner_id: number;
  product_id: number;
  status: number;
  start_date: Date;
  end_date: Date;
  created_ts: string;
  product_rate_id: number;
  qty: number;
  rent: number;
  start_hour: number;
  end_hour: number;
  ts: string;
  order_id: number;
  applied_discount_percent: number;
  applied_discount_amount: number;
  amount_paid: number;
  paid_transaction_id?: null;
  days: number;
  pickup_id: number;
  drop_id: number;
  product: IProduct;
  drop: DropOrPickup;
  renter: IUser;
  pickup: DropOrPickup;
}

export interface IProduct {
  id: number;
  user_id: number;
  category_id: number;
  sub_category_id: number;
  title: string;
  description: string;
  created_ts: string;
  transactions?: null;
  rating?: null;
  duration?: null;
  rate?: null;
  address_id: number;
  deposit?: null;
  home_delivery?: null;
  slug: string;
  status: number;
  qty: number;
  tags?: null;
  tou?: null;
  master_product_id?: null;
  discount_percent: number;
  featured: number;
  short_description?: null;
  includes?: null;
  masterProductList?: (null)[] | null;
  photos?: (ProductPhoto)[] | null;
  owner: IUser;
  location: ILocation;
  rates?: (IProductRatePlan)[] | null;
}
export interface ProductPhoto {
  id: number;
  user_id: number;
  product_id: number;
  filename: string;
  type: string;
  path: string;
  size: number;
  mimetype: string;
  status: number;
}

export interface IShortLocation {
  city?: string;
  lat?: string;
  lng?: string;
}

export interface ILocation {
  id: number;
  user_id: number;
  name?: null;
  lat: number;
  lng: number;
  address_line_1: string;
  address_line_2: string;
  sublocality?: null;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  display?: null;
  landmark: string;
  status: number;
  place_id: string;
}
export interface IProductRatePlan {
  id: number;
  user_id: number;
  product_id: number;
  rate: number;
  duration: string;
  surge_rate?: null;
  user_rate: number;
  durationDisplay?: string;
}
export interface DropOrPickup {
}


export interface ICheckboxOption {
  label: string;
  value: string;
}

export interface IProductFilter {
  rate?: [number, number];
  brand?: number[];
  category?: number;
  city?: string;
  subCategory?: number;
  page?: number;
}

export interface IProductCategory {
  id: number;
  title: string;
  subCategories?: IProductSubCategory[];
}

export interface IProductSubCategory {
  id: number;
  title: string;
}

export interface IDelivery {
  id: number;
  rep_id: number;
  rep_name: string;
}
