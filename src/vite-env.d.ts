// 声明图片资源模块
declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

// 声明 element-plus 语言包模块
declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const locale: any
  export default locale
}
