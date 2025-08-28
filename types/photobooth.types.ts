export interface Photobooth {
  id: number;
  name: string;
  description: string;
  location: string;
  event_date: string;
  slug?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PhotoboothRegistration {
  fullname: string;
  phone: string;
}

export interface PhotoboothRegistrationResponse {
  token: string;
  registration: {
    id: number;
    fullname: string;
    phone: string;
    photobooth_id: number;
    created_at: string;
  };
  photobooth?: Photobooth;
}

export interface PhotoboothFormData {
  name: string;
  slug: string;
  description?: string;
  location?: string;
  event_date?: string;
  is_active?: boolean;
}

export type TokenStatus = 'REGISTERED' | 'COMPLETED' | 'CANCELLED';

export interface PhotoboothToken {
  id: number;
  token: string;
  status: TokenStatus;
  guest: {
    id: number;
    photobooth_id: number;
    fullname: string;
    phone: string;
    created_at: string;
  };
  created_at: string;
  completed_at?: string | null;
  cancelled_at?: string | null;
}

export interface PhotoboothGuest {
  id: number;
  fullname: string;
  phone: string;
  tokens: PhotoboothToken[];
  created_at: string;
}