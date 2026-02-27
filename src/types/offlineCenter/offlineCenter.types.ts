
export interface OfflineCenter {
  id: string;
  name: string;
  city: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  image?: {
    secure_url: string;
    public_id: string;
  } | null;
  locationUrl?: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface OfflineCenterFilters {
  city?: string;
  isActive?: boolean;
}

export interface CreateOfflineCenterInput {
  name: string;
  city: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  image?: File | null | any;
  locationUrl?: string | null;
  isActive?: boolean;
  order?: number;
}

export interface UpdateOfflineCenterInput extends Partial<CreateOfflineCenterInput> {}
