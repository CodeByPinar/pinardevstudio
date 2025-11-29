export type UserRole = 'admin' | 'viewer';

export interface User {
  username: string;
  role: UserRole;
}

export interface ProjectData {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  type: string;
  tags: string[];
  description?: string;
  gallery?: string[];
  client?: string;
  role?: string;
  link?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string; // Supports simple markdown-like syntax
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  views?: number;
  author?: {
    name: string;
    role: string;
    avatar: string;
  };
}
