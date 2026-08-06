# 趣加速前端项目

基于 Vue3 + TypeScript + Element Plus + Vite 构建的现代化前端网站。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集
- **Element Plus** - 基于 Vue 3 的组件库
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器
- **Pinia** - Vue 状态管理库

## 功能特性

- 响应式布局设计
- 顶部导航栏（首页、套餐购买、软件下载、代理加盟）
- 用户注册/登录入口
- 底部信息栏（联系方式、二维码、版权信息）
- 路由守卫和页面标题动态设置

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000/ 预览项目

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 目录结构

```
qujiasu-front/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 可复用组件
│   ├── views/           # 页面视图
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   ├── utils/           # 工具函数
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── public/              # 公共静态资源
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 许可证

Copyright© 趣加速 (qujiasu.com) 版权所有
