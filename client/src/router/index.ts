import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Analysis from "../views/Analysis.vue";
import Overlay from "../views/Overlay.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/overlay/:roomId?",
    name: "Overlay", 
    component: Overlay,
    props: (route: Route) => ({
      roomId: route.params.roomId ?? null,
    })
  },
  {
    path: "/analysis/:roomId?",
    name: "Analysis", 
    component: Analysis,
    props: (route: Route) => ({
      roomId: route.params.roomId ?? null,
    })
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
