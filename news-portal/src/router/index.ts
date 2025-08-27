import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import ArticleDetail from "../views/ArticleDetail.vue"

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/article/:id", name: "ArticleDetail", component: ArticleDetail, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
