<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">📰 Últimas Noticias</h1>

    <!-- Buscador -->
    <input
      v-model="query"
      @keyup.enter="searchNews"
      type="text"
      placeholder="Buscar noticias..."
      class="w-1/4 p-3 mb-6 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <div v-if="newsStore.loading" class="text-center text-lg">Cargando...</div>
    <div v-else-if="newsStore.error" class="text-red-500">{{ newsStore.error }}</div>

    <!-- Solo mostrar grids que coinciden con la búsqueda -->
    <div class="grid md:grid-cols-3 gap-6">
      <NewsCard
        v-for="(article, index) in newsStore.articles"
        :key="index"
        :article="article"
        :index="index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from "vue";
import { useNewsStore } from "../store/news";
import NewsCard from "../components/NewsCard.vue";

const newsStore = useNewsStore();
const query = ref("");
const { proxy } = getCurrentInstance()!;

// Cargar noticias por defecto
onMounted(async () => {
  await newsStore.fetchNews();
  proxy.$toast.open({
    message: "Noticias cargadas correctamente 🎉",
    type: "success",
    position: "top-right",
    duration: 3000,
  });
});

// Buscar noticias
const searchNews = async () => {
  if (!query.value) return;
  await newsStore.fetchNews(query.value); // ✅ fetch con query
  proxy.$toast.open({
    message: `Resultados para "${query.value}"`,
    type: "success",
    position: "top-right",
    duration: 3000,
  });
};
</script>
