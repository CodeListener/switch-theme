# 浅析常见站点通用的主题肤色切换思路与实践

> 大家想必都浏览过一些站点，可以随着用户点击按钮切换暗黑主题，或者提供彩色面板设置颜色换肤功能，看起来是挺有趣的，刚好最近公司项目需要对相关系统进行样式改造同时支持主题色切换，虽然不是我的需求，不过自己还是可以实践一番的，毕竟只有自己动手过才能知道细节及其加深知识点印象，下次遇到也就是顺手拈来的事，不多废话我们开始吧

## 概述

> 本文基于 Vue3+typescript+vite,以三种方式的最小化 demo 示例来进行讲解，

1. 多样式 + class 切换 （明亮/暗黑模式）
2. css var + class 切换 （多肤色切换）
3. css var + setProperty （动态设置肤色切换）

这几个实例的实现方式实际上是一个层层递进优化的过程，本质都是换颜色：是黑白切换->多色设置->动态颜色设置。最后一种可以向下兼容可拓展比较好，但简单的也不需要搞得复杂，具体问题具体分析
这几种方式的原理都是基于 class 类切换 及其 js 动态设置 css 变量, 以下是主要的核心代码

```javascript
// 切换class
// 1, 2 示例使用class切换更改样式
function setClass(isDark = false) {
  const target = document.documentElement
  if (isDark) {
    target.classList.add('dark')
    target.classList.remove('light')
  } else {
    target.classList.add('light')
    target.classList.remove('dark')
  }
}

// 3 示例使用js动态设置css变量，在对应元素加上css变量,即可动态设置
const setCssVar = (key, val) => {
  document.documentElement.style.setProperty(key, val)
}
```

看起来是不是核心的很简单，下面介绍相关示例的实践

## 明亮/暗黑模式

明亮/暗黑模式其实就是在编写完目标样式之后多编写一套暗黑主题的 css 样式，当通过 class 切换，将指定目标设置成另外的颜色等样式

### 即时切换

即时切换即对编写的样式在请求的时候一并返回，达到切换无延迟效果，以下编写通过 vite 打包会对样式进行打包合并到一个文件,你也可以编写 dark.css 并在初始加载阶段一并引入， 针对暗黑模式下的相关元素进行样式设置，拷贝如下代码到 vue 文件运行即可预览

```html
<template>
  <div class="light-dark">
    <label for="mode">{{ isDark ? "暗黑模式" : "明亮模式" }}</label>
    <input id="mode" v-model="isDark" type="checkbox" />
    <h1 class="title">掘金开发者社区介绍</h1>
    <div class="content">
      <p>
        掘金开发者社区是一个专注于为开发者提供交流与学习的平台。这里汇聚了众多具有丰富开发经验和热衷于技术的专家和爱好者。我们致力于帮助开发者解决实际开发过程中遇到的问题，提升技能，以及了解最新的技术动态。
      </p>
      <p>
        相较于传统的开发者社区，掘金开发者社区更加注重实践与应用。我们强调将理论知识与实际操作相结合，帮助开发者更好地理解和掌握各种开发工具与技术。同时，我们也关注社区成员之间的互动与交流，鼓励彼此学习，共同进步。
      </p>
      <p>
        在掘金开发者社区，你可以参加各种形式的活动，包括线上技术分享、线下技术研讨会、编程竞赛等。这些活动旨在帮助开发者们提高技术水平，拓宽视野，以及增强团队协作能力。此外，我们还设有各类技术交流群组，方便成员们分享经验，讨论问题，相互学习。
      </p>
      <p>
        掘金开发者社区还提供了丰富的文档、教程、资源共享等服务。这些资料由社区成员自发贡献，内容涵盖了各种开发语言、框架和工具的使用指南与最佳实践。通过这些资料，你可以迅速找到需要的学习资源，提高开发效率。同时，社区还支持成员之间的资源共享，鼓励大家将工作中积累的宝贵经验与他人分享，实现价值最大化。
      </p>
      <p>
        总之，掘金开发者社区以其独特的氛围和全方位的服务，为开发者们提供了一个理想的交流与学习平台。在这里，你可以结识志同道合的朋友，提升自己的技术能力，发现更多的机会与挑战。加入掘金开发者社区，让我们一起迈向更广阔的未来！
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { setLightDarkClass } from '../utils/index'
  import { ref, watch } from 'vue'
  const isDark = ref(false)
  watch(isDark, (v) => {
    // class默认添加到html
    setLightDarkClass(v)
  })
</script>

<style lang="less">
  :root {
    // 默认明亮模式
    body {
      margin: 0;
      transition-property: color, background-color;
      transition-duration: 0.5s;
      transition-timing-function: ease;
      width: 100vw;
      height: 100vh;
      .light-dark {
        padding: 10px 20px;
        box-sizing: border-box;
      }
    }
    // 暗黑模式
    &.dark {
      body {
        background-color: #222;
        color: #fff;
      }
    }
  }
</style>
```

### 延迟加载

即时切换实际上就是将样式文件一次性加载，保证切换快速，不需要额外请求另一份样式之后在设置样式。针对于编写的 css 文件非常大(一般也不会)特定场景不同样式文件样式风格完全不同，我们可以将每一份样式表在切换的时候进行单独引用，主要步骤：

1. 编写一份默认样式及其多种风格样式文件：a.css, b.css, c.css;
2. 对默认加载样式的标签添加一个自定义属性[data-theme]
3. 根据切换时请求加载指定主题样式表对 style[data-theme]的指定标签内容进行替换

> **伪代码**如下

```javascript
// 加载远程样式表
function loadStyleSheet(themeName) {
  return axios.get(`${themeName}.css`)
}
// 设置指定样式表内容并添加到head
function createStyleTag(content) {
  const attr = 'data-theme'
  const themeStyleTag = document.querySelector(`[${attr}]`)
  if (themeStyleTag) {
    themeStyleTag.remove()
  }
  const styleTag = document.createElement('style')
  styleTag.setAttribute(attr, name)
  styleTag.innerHTML = content
  document.head.appendChild(styleTag)
}
// 切换主题
function setTheme(themeName) {
  loadStyleSheet(themeName).then((res) => {
    const text = res.data
    createStyleTag(text)
  })
}
document.addEventListener('load', function () {
  // 页面起初加载默认明亮模式
  setTheme('light')
})
```

以上我们通过 axios 的请求来实现加载异步样式表，如果你使用 vite 开发，还可以结合 import.meta.glob 及其 import() 来进行实现，可以打开 Network 进行验证，具体示例我放在 github 上，需要了解的朋友可以看看

## 多肤色切换

示例 1，我们通过使用 class+多样式编写切换，每次都要在不同的样式表中对目标设置指定颜色，假如好几种颜色的情况下，那就要编写更多的 css 了，写起来挺麻烦的，有没有可以让他们公用一套 css 呢？这里就要说到 css 变量啦，如下时使用 css 变量和没有使用的区分

- 没有使用 css 变量时

```css
body {
  background-color: #fff;
  color: #000;
}
/* red主题 */
html.red body {
  background-color: red;
  color: rgb(206, 206, 206);
}
/* blue主题 */
html.blue body {
  background-color: blue;
  color: rgb(206, 206, 206);
}
/* orange主题 */
html.orange body {
  background-color: orange;
  color: rgb(206, 206, 206);
}
```

- 使用 css 变量时：

```css
html {
  --text-color: #222;
  &.red {
    --bg-color: rgb(245, 45, 45);
    --text-color: #fff;
    /* more style... */
  }
  &.blue {
    --bg-color: rgb(76, 76, 230);
    --text-color: #fff;
    /* more style... */
  }
  &.orange {
    --bg-color: orange;
    --text-color: #fff;
    /* more style... */
  }
}
html body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

可以看出加入样式以多且需要设置的颜色也多的情况下，重复性的样式编写就成倍增长，在引用变量之后，我们只需要维护 css 变量即可，在切换 class 对 css 变量设置成不同的颜色值即可

> 示例

## 动态设置肤色切换

动态设置肤色则是比多肤色切换的更高自由度，多肤色需要我们项目定义好颜色，而动态设置则是把选择权交给了用户，用户想什么颜色主题就什么颜色主题。摆脱了每种主题类变量编写的区分（相当于移除示例二的多类 css 变量编写），通过 js 来对 css 变量进行控制，以下是最小化**伪代码**

```html
<style>
  :root {
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
<script setup lang="ts">
  import { ref, watch } from 'vue'
  const currentColor = ref('#1f53ff')
  const setCssVar = (key: string, val: string) => {
    document.documentElement.style.setProperty(key, val)
  }
  watch(currentColor, (v) => {
    setCssVar('--theme-color', v)
  })
</script>
```
> 示例
