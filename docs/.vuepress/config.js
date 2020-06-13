module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "~": "/docs",
      },
    },
  },
  plugins: [
    ["@vuepress/back-to-top"], // 返回顶部
    ["@vuepress/nprogress"], // 加载进度条
    // {
    //   name: "carbon-ads",
    //   globalUIComponents: ["carbon-ads"],
    // },
    [
      "vuepress-plugin-comment",
      {
        choosen: "gitalk",
        options: {
          clientID: "4d4286364fd4fe8faa50",
          clientSecret: "c2fe69945bdb7813d867356a5713dd550ca1b462",
          repo: "https://6gunner.github.io/",
          owner: "6gunner",
          admin: ["6gunner"],
          distractionFreeMode: false,
          container: "gitalk-container",
        },
      },
    ],
  ],

  title: "Coda的博客",
  description: "闲着无聊？那就读书吧",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    nav: [
      { text: "主页", link: "/" },
      { text: "服务端", link: "/服务端/" },
      { text: "前端", link: "/前端/" },
      { text: "node", link: "/node/" },
      { text: "android", link: "/android/" },
      { text: "devOps", link: "/DevOps/" },
    ],
    sidebar: "auto",
  },
};
