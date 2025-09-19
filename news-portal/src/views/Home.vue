<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Encabezado -->
    <h1 class="text-4xl font-extrabold mb-4 text-center text-black bg-clip-text ">
      Portal de Noticias
    </h1>

    <p class="text-lg font-lg text-center mb-4 text-black bg-clip-text ">
      Mantente informado con las últimas noticias de todo el mundo.
    </p>

    <!-- Buscador -->
    <div class="flex justify-center mb-8">
      <div class="relative w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search/>
        </span>
        <input
          v-model="query"
          @keyup.enter="searchNews"
          type="text"
          placeholder="Buscar noticias..."
          class="w-full p-3 pl-10 border border-gray-300 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Buscar noticias..."
        />
      </div>
    </div>

    <!-- Estado de carga o error -->
    <div v-if="newsStore.loading" class="flex items-center justify-center w-full min-h-screen"><Loader class="size-10"/></div>
    <div v-else-if="newsStore.error" class="text-center text-red-500 font-semibold w-full min-h-screen">{{ newsStore.error }}</div>

    <!-- Grid de noticias -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <NewsCard
        v-for="(article, index) in newsStore.articles"
        :key="index"
        :article="article"
        :index="index"
      />
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-center mt-10 space-x-4">
      <button
        class="px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="newsStore.page === 1"
        @click="previousPage"
      >
        <ArrowLeft/>
      </button>

      <span class="text-black font-semibold ">
        Página {{ newsStore.page }} / {{ totalPages }}
      </span>

      <button
        class="px-5 py-2 rounded-full border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="newsStore.page >= totalPages"
        @click="nextPage"
      >
        <ArrowRight/>
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, watch, computed } from "vue";
import { useNewsStore } from "../store/news";
import NewsCard from "../components/NewsCard.vue";
import debounce from "lodash/debounce";
import { Search, ArrowRight, ArrowLeft, Loader } from "lucide-vue-next";

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

