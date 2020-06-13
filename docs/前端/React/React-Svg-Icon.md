# 怎么在项目里使用svg图片？

- 在react里使用

1. 直接使用svg标签

```jsx
<SvgIcon>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <circle cx="15.5" cy="15.5" r="4" stroke="#595959" />
    <path
      d="M15.5 13.5V15.5H17.5"
      stroke="#595959"
      stroke-linecap="round"
      />
    <rect
      x="8"
      y="9"
      width="6"
      height="1"
      rx="0.5"
      fill="#595959"
      />
    <rect
      x="8"
      y="12"
      width="3"
      height="1"
      rx="0.5"
      fill="#595959"
      />
    <rect
      x="8"
      y="15"
      width="2"
      height="1"
      rx="0.5"
      fill="#595959"
      />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.5 6C5.94771 6 5.5 6.44772 5.5 7V19C5.5 19.5523 5.94771 20 6.5 20H11C11.2761 20 11.5 19.7761 11.5 19.5C11.5 19.2239 11.2761 19 11 19H6.5V7L15.5 7V8V9.5C15.5 9.77614 15.7239 10 16 10C16.2761 10 16.5 9.77614 16.5 9.5V9H18C18.2761 9 18.5 9.22386 18.5 9.5V11C18.5 11.2761 18.7239 11.5 19 11.5C19.2761 11.5 19.5 11.2761 19.5 11V9.5C19.5 8.67157 18.8284 8 18 8H16.5V7C16.5 6.44772 16.0523 6 15.5 6H6.5Z"
      fill="#595959"
      />
  </svg>
</SvgIcon>
```



React-svg-loader的使用









- 在nuxt项目里

**安装依赖**： `@nuxtjs/svg`

**配置nuxt.js**: 

![image-20200526161218858](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-05-26-081219.png)

引入svg图片，类型为raw:

```js
import HBLogo from "~/assets/Huobi.svg?raw"; 

export default {
  name: "Investors",
  data() {
    return {    
      imgList: [
        HBLogo,
      ]
    }
  }
}
```

在html里使用svg图片，作为html标签代码

```vue
<div class="imgDiv" v-for="(item, index) of imgList" :key="index">
  <div v-html="item" class="svg"></div>
</div>
```

