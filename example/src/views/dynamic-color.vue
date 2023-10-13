<template>
  <div class="wrapper dynamic-color">
    <button style="margin-top: 50px" type="button">按钮</button>
    <br />
    <a target="_blank" href="https://juejin.cn/">掘金开发者社区</a>
    <br />
    <div class="tag">
      <span>标签</span>
    </div>
    <br />
    <label for="picker"><input v-model="currentColor" type="color" name="picker" id="picker" />&nbsp;<span>颜色选择</span></label>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
const currentColor = ref("#1f53ff");
const setCssVar = (key: string, val: string) => {
  document.documentElement.style.setProperty(key, val);
};

watch(currentColor, (v) => {
  setCssVar("--theme-color", v);
});
</script>

<style lang="less" scoped>
:global(:root) {
  // 由于为了方便才写到这里，可以将这块变量抽离出单独文件进行维护，在main.ts主入口引入
  --theme-color: rgb(31, 83, 255);
  // button
  --button-background-color: var(--theme-color);
  // link
  --link-text-color: var(--theme-color);
  // tag
  --tag-border-color: var(--theme-color);
  --tag-text-color: var(--theme-color);
}

button {
  background-color: var(--button-background-color);
  color: #fff;
  width: 100px;
  line-height: 30px;
  border: none;
  border-radius: 18px;
}
a {
  color: var(--link-text-color);
}
.tag {
  border: 1px solid var(--tag-border-color);
  color: var(--tag-text-color);
  cursor: pointer;
  padding: 2px 10px;
  border-radius: 8px;
}
</style>
