import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { installRouter } from "./router";
const app = createApp(App);
installRouter(app);
app.mount("#app");
