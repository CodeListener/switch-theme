import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import { App } from "vue";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    children: [
      {
        path: "light-dark",
        component: () => import("../views/light-dark.vue"),
      },
      {
        path: "delay-load-light-dark",
        component: () => import("../views/delay-load-light-dark.vue"),
      },
      {
        path: "switch-theme",
        component: () => import("../views/switch-theme.vue"),
      },
      {
        path: "dynamic-color",
        component: () => import("../views/dynamic-color.vue"),
      },
    ],
  },
];
const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

router.beforeEach(() => {
  const target = document.documentElement;
  document.documentElement.classList.remove(...[...target.classList.values()]);
  const attr = "data-theme";
  const themeStyleTag = document.querySelector(`[${attr}]`);
  if (themeStyleTag) {
    themeStyleTag.remove();
  }
});
export function installRouter(app: App) {
  app.use(router);
}
