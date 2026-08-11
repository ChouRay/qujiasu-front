/**
 * 错误消息映射工具类
 * 用于将后端返回的错误码转换为友好的中文提示消息
 */

// 错误码与消息的映射关系
const ERROR_MESSAGE_MAP: Record<string, string> = {
  // 通用错误
  'common.resource_not_found': '资源不存在',
  'common.validation_failed': '参数验证失败',
  'common.bind_failed': '参数绑定失败',
  'common.missing_parameter': '缺少必要参数',
  'common.type_mismatch': '参数类型不匹配',
  'common.method_not_supported': '请求方法不支持',
  'common.authentication_failed': '认证失败，请重新登录',
  'common.authorization_failed': '无权限访问',
  'common.internal_server_error': '服务器内部错误',
  'common.runtime_error': '系统运行错误',
  'common.invalid_argument': '参数无效',
  'common.unsupported_operation': '不支持的操作',
  'common.illegal_state': '状态异常',

  // 认证相关错误
  'auth.invalid_credentials': '账号或密码错误',
  'auth.account_not_found': '账号不存在',
  'auth.account_locked': '账号已被锁定',
  'auth.account_disabled': '账号已被禁用',

  // 用户相关错误
  'user.not_found': '用户不存在',
  'user.upper_agent_not_found': '上级代理不存在',
  'user.password_update_failed': '密码修改失败',
  'user.invalid_sms_code': '验证码错误或已过期',
  'user.invalid_param': '参数无效',
  'user.invalid_password': '密码错误',
  'user.update_failed': '用户信息更新失败',
  'user.invite_code_invalid': '邀请码无效',
  'user.invite_user_id_invalid': '邀请用户 ID 无效',
  'user.invalid_user_id': '用户 ID 无效',
  'user.certify_failed': '实名认证失败',
  'user.cycle_reference_not_allowed': '不允许循环引用',
  'user.phone_number_already_exists': '手机号已被注册',
  'user.invitation_code_not_found': '邀请码不存在',
  'user.slide_verification_failed': '滑块验证失败',
  'user.invalid_token_format': '令牌格式无效',
  'user.system_busy': '系统繁忙，请稍后重试',
  'user.phone_number_required': '请输入手机号',
  'user.csession_id_required': '会话 ID 不能为空',
  'user.invitation_code_required': '请输入邀请码',
  'user.login_id_required': '登录 ID 不能为空',
  'user.user_id_required': '用户 ID 不能为空',
  'user.query_value_required': '查询参数不能为空',

  // 订单相关错误
  'order.self_conflict': '存在未支付订单，请先完成支付或删除后重试',
  'order.not_found': '订单不存在',
  'order.status_not_allowed_delete': '当前订单状态不允许删除',
  'order.product_id_required': '请选择产品',
  'order.username_already_taken': '账号已被使用',
  'order.unsupported_order_type': '不支持的订单类型',
  'order.invalid_message_format': '消息格式无效',

  // 支付相关错误
  'pay.callback_failed': '支付回调处理失败',
  'pay.admin_recharge.sms_invalid': '充值短信验证码无效',
  'pay.admin_recharge.target_not_found': '充值目标用户不存在',
  'pay.withdraw.not_found': '提现记录不存在',
  'pay.withdraw.unknown_destination': '未知的提现目标',
  'pay.withdraw.already_completed': '提现已完成',
  'pay.withdraw.not_completed': '提现未完成',
  'pay.withdraw.insufficient_balance': '余额不足',
  'pay.trade_type_required': '请选择支付方式',
  'pay.unsupported_trade_type': '不支持的支付方式',

  // 产品相关错误
  'product.metadata_not_found': '产品版本不存在',
  'product.delete_failed': '产品删除失败',
  'product.version_already_exists': '产品版本已存在',

  // 套餐相关错误
  'package.change_password_failed': '修改密码失败',
  'package.package_not_found': '套餐不存在',
  'package.context_error': '上下文错误',
  'package.username_already_exists': '账号已存在',
  'package.user_id_required': '用户 ID 不能为空',
  'package.package_id_required': '套餐 ID 不能为空',
  'package.missing_username': '账号不能为空',
  'package.id_required': 'ID 不能为空',
  'package.id_mismatch': 'ID 不匹配',

  // 客户端相关错误
  'client.user_expire': '账号已过期，请续费后使用',
  'client.user_game_not_bound': '请先绑定应用',
  'client.ip_apply_too_frequent': '换 IP 过于频繁，请稍后再试',
  'client.usage_full': '在线设备数已满',
  'client.no_ip_available': '暂无可用 IP，请稍后重试'
}

/**
 * 根据错误码获取对应的错误消息
 * @param errorCode - 错误码，如 "common.resource_not_found"
 * @param defaultMessage - 默认消息，当错误码不存在时返回
 * @returns 对应的错误消息
 */
export function getErrorMessage(errorCode: string, defaultMessage?: string): string {
  return ERROR_MESSAGE_MAP[errorCode] || defaultMessage || errorCode
}

/**
 * 检查错误码是否存在
 * @param errorCode - 错误码
 * @returns 是否存在
 */
export function hasErrorCode(errorCode: string): boolean {
  return errorCode in ERROR_MESSAGE_MAP
}

/**
 * 获取所有错误码
 * @returns 错误码数组
 */
export function getAllErrorCodes(): string[] {
  return Object.keys(ERROR_MESSAGE_MAP)
}

/**
 * 批量获取错误消息
 * @param errorCodes - 错误码数组
 * @returns 错误消息对象
 */
export function getErrorMessages(errorCodes: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  errorCodes.forEach(code => {
    result[code] = getErrorMessage(code)
  })
  return result
}

export default {
  getErrorMessage,
  hasErrorCode,
  getAllErrorCodes,
  getErrorMessages,
  ERROR_MESSAGE_MAP
}
