export type Category = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  code?: string;
  destaque?: boolean;
};

export type Product = {
  id: number;
  name: string;
  description?: string;
  image: string;
  price: number;
  badge?: string;
  active?: boolean;
  is_best_seller?: boolean;
  category: Category; // 🔥 AGORA É OBJETO
};