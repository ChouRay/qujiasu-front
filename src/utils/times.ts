/**
 * 格式化时间为 yyyy-MM-dd 格式
 * @param timestamp - 时间戳、Date对象或日期字符串
 * @returns 格式化后的日期字符串 (yyyy-MM-dd)
 */
export function formatDate(timestamp: number | string | Date): string {
  const date = new Date(timestamp)
  
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}
