export interface Banner {
  id: string;
  title: string;
  image: {
    url: string;
    publicId: string;
  };
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerInput {
  title: string;
  image: {
    url: string;
    publicId: string;
  };
  link?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {}
