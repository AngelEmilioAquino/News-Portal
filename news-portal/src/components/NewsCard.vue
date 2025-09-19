<script setup lang="ts">
import type { Article } from "../store/news";
import { ArrowRight } from "lucide-vue-next";

defineProps<{ article: Article; index: number }>();
</script>

<template>
  <div class="bg-white p-4 my-4 rounded-lg shadow-lg transition-all duration-500">
    <img v-if="article.urlToImage"
    :src="article.urlToImage || 'https://ui.shadcn.com/placeholder.svg'" 
    alt="News Image"
    class="w-full h-64 object-cover rounded-lg mb-4"
    >
    <img v-else="article.urlToImage"
    :src="article.urlToImage || 'https://ui.shadcn.com/placeholder.svg'" 
    alt="News Image"
    class="w-full h-64 object-cover rounded-lg mb-4"
    >
    <h2 class="text-xl font-bold mb-2">{{ article.title }}</h2>
    <p class="text-gray-600 mb-4">{{ article.description}}</p>
    <p class="text-gray-600 mb-4">{{ article.publishedAt.slice(0, 10) }}</p>
    <router-link
      :to="{ name: 'ArticleDetail', params: { id: index } }"
      class="text-blue-600 font-medium hover:underline"
    >
      Leer más <ArrowRight class="inline-block size-6"/>
    </router-link>
  </div>

</template>

