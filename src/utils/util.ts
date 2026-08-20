/**
 * 综合判断（推荐使用）
 */
export function isMobile(ua): boolean {
  // User Agent 判断
  const isMobileUA = /Android|iPhone|webOS|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  
  // 屏幕尺寸判断
  const isSmallScreen = window.innerWidth <= 768;
  
  // 触摸支持判断
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // 综合判断：UA 为移动端，或（小屏幕且有触摸支持）
  return isMobileUA || (isSmallScreen && hasTouchSupport);
}