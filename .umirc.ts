import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'leaf-ui',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  menus: {
    // 需要自定义侧边菜单的路径，没有配置的路径还是会使用自动生成的配置
    '/components': [
      {
        children: ['/components/Button/index.md'],
      },
      {
        children: ['/components/Space/index.md'],
      },
      {
        children: ['/components/Switch/index.md'],
      },
      {
        children: ['/components/Carousel/index.md'],
      },
      {
        children: ['/components/InfiniteScroll/index.md'],
      },
      {
        children: ['/components/AnimateList/index.md'],
      },
      {
        children: ['/components/Image/index.md'],
      },
      {
        children: ['/components/Message/index.md'],
      },
      {
        children: ['/components/Select/index.md'],
      },
      {
        children: ['/components/Collapse/index.md'],
      },
      {
        children: ['/components/Icon/index.md'],
      },
      {
        children: ['/components/Alert/index.md'],
      },
      {
        children: ['/components/Input/index.md'],
      },
      {
        children: ['/components/Menu/index.md'],
      },
      {
        children: ['/components/Progress/index.md'],
      },
      {
        children: ['/components/AutoComplete/index.md'],
      },
      {
        children: ['/components/Tabs/index.md'],
      },
      {
        children: ['/components/Upload/index.md'],
      },
    ],
  },
  // more config: https://d.umijs.org/config,
  cssModulesTypescriptLoader: {
    mode: 'emit',
  },
});
