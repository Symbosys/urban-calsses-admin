
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  thumbnail?: {
    url: string;
    publicId: string;
  } | null;
  category?: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string | null;
  authorName?: string | null;
  authorImage?: {
    url: string;
    publicId: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  category?: string;
  isPublished?: boolean;
  search?: string;
}

export interface CreateBlogInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: {
    url: string;
    publicId: string;
  } | null;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  authorName?: string;
  authorImage?: {
    url: string;
    publicId: string;
  } | null;
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {
  id: string;
}
