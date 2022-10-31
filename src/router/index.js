import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import UserSide from "../views/UserSide.vue";
import Auth from "../views/Auth.vue";

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: Home,
  },
  {
    path: "/user",
    name: "UserSide",
    component: UserSide,
  },
  {
    path: "/auth",
    name: "AuthComp",
    component: Auth,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
