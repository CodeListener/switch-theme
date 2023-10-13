<template>
  <div class="light-dark wrapper">
    <label for="mode"> {{ isDark ? "暗黑模式" : "明亮模式" }} </label>
    <input id="mode" v-model="isDark" type="checkbox" />
    <Example />
  </div>
</template>
<script setup lang="ts">
import Example from "../components/Example.vue";

import { setLightDarkClass } from "../utils/index";
import { ref, watch } from "vue";
import axios from "axios";
const isDark = ref(false);
// 加载远程样式表
function loadStyleSheet(themeName: string) {
  // 在请求样式表之后可以自己加到缓存，避免多次请求
  return axios.get(`${themeName}.css`);
}
// 设置指定样式表内容并添加到head
function createStyleTag(themeName: string, content: string) {
  const attr = "data-theme";
  const themeStyleTag = document.querySelector(`[${attr}]`);
  if (themeStyleTag) {
    themeStyleTag.remove();
  }
  const styleTag = document.createElement("style");
  styleTag.setAttribute(attr, themeName);
  styleTag.innerHTML = content;
  document.head.appendChild(styleTag);
}

watch(
  isDark,
  (v) => {
    // class默认添加到html
    setLightDarkClass(v);
    const themeName = v ? "dark" : "light";
    loadStyleSheet(themeName).then((res) => {
      const style = res.data;
      createStyleTag(themeName, style);
    });
  },
  {
    immediate: true,
  }
);
</script>
