<script setup lang="ts"></script>

<template>
  <div>
    <div class="btns">
      <router-link to="/light-dark"><span>明亮/暗黑模式</span></router-link>
      <router-link to="/delay-load-light-dark"><span>延迟加载-明亮/暗黑模式</span></router-link>
      <router-link to="/switch-theme"><span>主题选择</span></router-link>
      <router-link to="/dynamic-color"><span>动态肤色</span></router-link>
    </div>
    <router-view></router-view>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped lang="less">
.btns {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 18px;
  border: 2px solid #efefef;
  padding: 0 10px;
  top: 6px;
  white-space: nowrap;
  a {
    font-size: 12px;
    text-decoration: none;
    color: #222;
    line-height: 40px;
    span {
      padding: 0 10px;
    }
    &:hover {
      opacity: 0.7;
    }
    &.router-link-exact-active {
      color: dodgerblue;
    }
  }
  a + a {
    span {
      border-left: 1px solid #333;
    }
  }
}
</style>
