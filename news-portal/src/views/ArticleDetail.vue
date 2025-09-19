<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useNewsStore } from "../store/news";

const route = useRoute();
const newsStore = useNewsStore();

const article = computed(() => {
  const id = Number(route.params.id);
  return newsStore.articles[id];
});
</script>

<template>
<div class="p-6">
    <router-link to="/" class="text-blue-600 hover:underline">← Volver</router-link>

    <div v-if="article" class="mt-4">
      <h1 class="text-3xl font-bold mb-4">{{ article.title }}</h1>
      <img v-if="article.urlToImage" :src="article.urlToImage || 'https://ui.shadcn.com/placeholder.svg'" class="w-full h-96 object-cover rounded-md mb-6" />
      <img v-else="article.urlToImage" :src="article.urlToImage || 'https://ui.shadcn.com/placeholder.svg'" class="w-full h-96 object-cover rounded-md mb-6" />
      <p class="text-lg mb-4">{{ article.content || article.description }}</p>
      <a :href="article.url" target="_blank" class="text-blue-600 hover:underline">
        Ver noticia completa
      </a>
    </div>

    <div v-else class="text-red-500">Artículo no encontrado</div>
  </div>
</template>

