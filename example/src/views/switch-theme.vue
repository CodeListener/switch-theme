<template>
  <div class="wrapper">
    <div class="switch-btn">
      <button class="red" @click="switchTheme('red')"></button>
      <button class="blue" @click="switchTheme('blue')"></button>
      <button class="orange" @click="switchTheme('orange')"></button>
    </div>
  </div>
  <Example />
</template>
<script setup lang="ts">
import { ref } from "vue";
import Example from "../components/Example.vue";
type Theme = "red" | "blue" | "orange";
const currentTheme = ref<Theme>();
const switchTheme = (themeName: Theme) => {
  const target = document.documentElement;
  if (currentTheme.value && target.classList.contains(currentTheme.value)) {
    target.classList.remove(currentTheme.value);
  }
  currentTheme.value = themeName;
  document.documentElement.classList.add(themeName);
};
</script>

<style lang="less">
:root {
  --text-color: #222;
  &.red {
    --bg-color: rgb(245, 45, 45);
    --text-color: #fff;
  }
  &.blue {
    --bg-color: rgb(76, 76, 230);
    --text-color: #fff;
  }
  &.orange {
    --bg-color: orange;
    --text-color: #fff;
  }
  body {
    background-color: var(--bg-color);
    color: var(--text-color);
  }
}
.switch-btn {
  display: flex;
  align-items: center;
  button {
    width: 28px;
    height: 28px;
    border-radius: 100%;
    cursor: pointer;
    border: 2px solid #999;
    &.red {
      background-color: rgb(245, 45, 45);
    }
    &.blue {
      background-color: rgb(76, 76, 230);
    }
    &.orange {
      background-color: orange;
    }
    &:hover {
      opacity: 0.7;
    }
  }
  button + button {
    margin-left: 10px;
  }
}
</style>
