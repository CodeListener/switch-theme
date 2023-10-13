<template>
  <div class="wrapper">
    <label for="mode"> {{ isDark ? "暗黑模式" : "明亮模式" }} </label>
    <input id="mode" v-model="isDark" type="checkbox" />
    <Example />
  </div>
</template>
<script setup lang="ts">
import Example from "../components/Example.vue";
import { setLightDarkClass } from "../utils/index";
import { ref, watch } from "vue";
const isDark = ref(false);
watch(isDark, (v) => {
  // class默认添加到html
  setLightDarkClass(v);
});
</script>

<style lang="less">
:root {
  // 默认样式
  // ....

  // 暗黑模式
  &.dark {
    body {
      background-color: #222;
      color: #fff;
    }
  }
}
</style>
