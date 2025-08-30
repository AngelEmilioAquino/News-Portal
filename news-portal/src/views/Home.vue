<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">📰 Últimas Noticias</h1>

    <!-- Buscador -->
    <input
      v-model="query"
      @keyup.enter="searchNews"
      type="text"
      placeholder="Buscar noticias..."
      class="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-3 mb-6 border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      aria-label="Buscar noticias..."
    />

    <div v-if="newsStore.loading" class="text-center text-lg">Cargando...</div>
    <div v-else-if="newsStore.error" class="text-red-500">{{ newsStore.error }}</div>

    <!-- Solo mostrar grids que coinciden con la búsqueda -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NewsCard
        v-for="(article, index) in newsStore.articles"
        :key="index"
        :article="article"
        :index="index"
      />
    </div>

    <div class="flex items-center justify-center mt-6 mb-4">
      <button
        class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        :disabled="newsStore.page === 1"
        @click="previousPage"
      >
        ⬅️ Anterior
      </button>

      <span class="text-lg font-semibold mx-4">
        Página {{ newsStore.page }} /
        {{ totalPages }}
      </span>

      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        :disabled="newsStore.page >= totalPages"
        @click="nextPage"
      >
        Siguiente ➡️
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, watch, computed } from "vue";
import { useNewsStore } from "../store/news";
import NewsCard from "../components/NewsCard.vue";
import debounce from "lodash/debounce";

const newsStore = useNewsStore();
const query = ref("");
const { proxy } = getCurrentInstance()!;

// Cargar noticias por defecto
onMounted(async () => {
  await newsStore.fetchNews();
});

// 🔹 Debounce para evitar llamadas excesivas
const debouncedSearch = debounce((q: string) => {
  newsStore.page = 1;
  newsStore.fetchNews(q);
}, 500);

// 🔹 Watch para escuchar cambios en query
watch(query, (newQuery) => {
  if (!newQuery) {
    newsStore.page = 1;
    newsStore.fetchNews(); 
  } else {
    debouncedSearch(newQuery); 
  }
});

// 🔹 Buscar noticias al presionar Enter
const searchNews = async () => {
  if (!query.value) return;
  await newsStore.fetchNews(query.value); 
  proxy.$toast.open({
    message: `Resultados para "${query.value}"`,
    type: "success",
    position: "top-right",
    duration: 3000,
  });
};

// 🔹 Total de páginas calculado
const totalPages = computed(() =>
  Math.ceil(newsStore.totalResults / newsStore.pageSize) || 1
);

// 🔹 Paginación
const previousPage = () => {
  if (newsStore.page > 1) {
    newsStore.fetchNews(query.value, newsStore.page - 1);
  }
};

const nextPage = () => {
  if (newsStore.page < totalPages.value) {
    newsStore.fetchNews(query.value, newsStore.page + 1);
  }
};
</script>

