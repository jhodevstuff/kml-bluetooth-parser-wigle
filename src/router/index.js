import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue";
import FindView from "../views/FindView.vue";
import CompareView from "../views/CompareView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/compare",
      name: "compare",
      component: CompareView,
    },
    {
      path: "/analyze",
      name: "analyze",
      component: FindView,
    }
  ],
});

export default router
