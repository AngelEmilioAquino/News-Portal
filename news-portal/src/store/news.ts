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
}

export const useNewsStore = defineStore("news", {
  state: (): State => ({
    articles: [] as Article[],       
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchNews(query?: string) {
      this.loading = true;
      this.error = null;
      try {
        const url = query
          ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=es&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
          : `https://newsapi.org/v2/top-headlines?country=us&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;
        const res = await axios.get(url);
        this.articles = res.data.articles; 
      } catch {
        this.error = "Error al obtener noticias";
        this.articles = [];
      } finally {
        this.loading = false;
      }
    },
  },
  persist: true,
});
