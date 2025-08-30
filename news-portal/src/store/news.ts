import axios from "axios";
import { defineStore } from "pinia";

export interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface State {
  articles: Article[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalResults: number;
}

export const useNewsStore = defineStore("news", {
  state: (): State => ({
    articles: [] as Article[],       
    loading: false,
    error: null as string | null,
    page: 1,
    pageSize: 9,
    totalResults: 0,
  }),
  actions: {
    async fetchNews(query?: string, page: number = 1) {
  this.loading = true;
  this.error = null;
  this.page = page; // Actualiza la página actual
  try {
    const url = `https://newsapi.org/v2/everything?${
      query ? `q=${query}&` : "q=general&"
    }page=${this.page}&pageSize=${this.pageSize}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;
    const res = await axios.get(url);
    this.totalResults = res.data.totalResults;
    this.articles = res.data.articles;
  } catch (err) {
    this.error = "Error al obtener noticias";
    this.articles = [];
    this.totalResults = 0;
  } finally {
    this.loading = false;
  }
}
  },
 persist:true,
});

