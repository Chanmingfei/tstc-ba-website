/** @type {import('tailwindcss').Config} */
module.exports = {
  // 仅扫描本站真正使用的文件，避免把模板目录里的类打进生产 CSS
  content: [
    './index.html',
    './news.html',
    './about.html',
    './404.html',
    './dzl.html',
    './news/post-*.html',
    './assets/main.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0465bc',
        secondary: '#2575fc',
        accent: '#4c94ff',
        light: '#f0f4f8',
        dark: '#333333'
      },
      fontFamily: {
        // 纯系统字体，不依赖任何外部字体服务，中文渲染友好
        inter: ['PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', 'sans-serif']
      }
    }
  },
  plugins: []
};
