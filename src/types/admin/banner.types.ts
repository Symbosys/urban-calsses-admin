export interface Banner {
  id: string;
  title: string;
  image: {
    secure_url: string;
    public_id: string;
  };
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerInput {
  title: string;
  image: File | null | any;
  link?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {}
