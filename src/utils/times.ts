/**
 * 格式化时间工具类
 */

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

/**
 * 格式化时间为 HH:mm:ss 格式
 * @param timestamp - 时间戳、Date对象或日期字符串
 * @returns 格式化后的时间字符串 (HH:mm:ss)
 */
export function formatTime(timestamp: number | string | Date): string {
  const date = new Date(timestamp)
  
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${hours}:${minutes}:${seconds}`
}

/**
 * 格式化时间为完整格式 yyyy-MM-dd HH:mm:ss
 * @param timestamp - 时间戳、Date对象或日期字符串
 * @returns 格式化后的日期时间字符串 (yyyy-MM-dd HH:mm:ss)
 */
export function formatDateTime(timestamp: number | string | Date): string {
  const dateStr = formatDate(timestamp)
  const timeStr = formatTime(timestamp)
  
  if (!dateStr || !timeStr) {
    return ''
  }
  
  return `${dateStr} ${timeStr}`
}
