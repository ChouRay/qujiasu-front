/**
 * 错误消息映射工具类
 * 用于将后端返回的错误码转换为友好的中文提示消息
 */

// 错误码与消息的映射关系
const ERROR_MESSAGE_MAP: Record<string, string> = {
 // ========== 通用错误 (CommonErrorCode / CommonResponseCode) ==========
  "common.resource_not_found": "资源不存在",
  "common.validation_failed": "参数验证失败",
  "common.bind_failed": "参数绑定失败",
  "common.missing_parameter": "缺少必要参数",
  "common.type_mismatch": "参数类型不匹配",
  "common.method_not_supported": "请求方法不支持",
  "common.authentication_failed": "认证失败，请重新登录",
  "common.authorization_failed": "无权限访问",
  "common.payment_required": "请先完成支付",
  "common.internal_server_error": "服务器内部错误",
  "common.runtime_error": "系统运行错误",
  "common.invalid_argument": "参数无效",
  "common.unsupported_operation": "不支持的操作",
  "common.illegal_state": "状态异常",

  // ========== 认证相关 (AuthErrorCode) ==========
  "auth.invalid_credentials": "账号或密码错误",
  "auth.account_not_found": "账号不存在",
  "auth.account_locked": "账号已被锁定",
  "auth.account_disabled": "账号已被禁用",
  "auth.dependency_unavailable": "依赖服务暂不可用，请稍后重试",
  "auth.wechat_auth_failed": "微信认证失败",

  // ========== 用户相关 (UserErrorCode) ==========
  "user.not_found": "用户不存在",
  "user.upper_agent_not_found": "上级代理不存在",
  "user.password_update_failed": "密码修改失败",
  "user.invalid_sms_code": "验证码错误或已过期",
  "user.invalid_param": "参数无效",
  "user.invalid_password": "密码错误",
  "user.update_failed": "用户信息更新失败",
  "user.invite_code_invalid": "邀请码无效",
  "user.invite_user_id_invalid": "邀请用户ID无效",
  "user.invalid_user_id": "用户ID无效",
  "user.certify_failed": "实名认证失败",
  "user.cycle_reference_not_allowed": "不允许循环引用",
  "user.inviter_already_bound": "已绑定邀请人，无法重复绑定",
  "user.phone_number_already_exists": "手机号已被注册",
  "user.invitation_code_not_found": "邀请码不存在",
  "user.slide_verification_failed": "滑块验证失败",
  "user.invalid_token_format": "令牌格式无效",
  "user.system_busy": "系统繁忙，请稍后重试",
  "user.phone_number_required": "请输入手机号",
  "user.captcha_ticket_required": "人机验证未完成，请重新验证",
  "user.invitation_code_required": "请输入邀请码",
  "user.login_id_required": "登录ID不能为空",
  "user.user_id_required": "用户ID不能为空",
  "user.query_value_required": "查询参数不能为空",

  // ========== 订单相关 (OrderErrorCode) ==========
  "order.self_conflict": "存在未支付订单，请去订单管理完成支付或删除后重试",
  "order.not_found": "订单不存在",
  "order.status_not_allowed_close": "当前订单状态不允许关闭",
  "order.product_id_required": "请选择产品",
  "order.username_already_taken": "账号已被使用",
  "order.unsupported_order_type": "不支持的订单类型",
  "order.invalid_message_format": "消息格式无效",
  "order.username_required": "请输入账号",
  "order.product_not_found": "产品不存在",
  "order.product_not_sellable": "产品已下架或不可购买",
  "order.not_payable": "订单当前不可支付",
  "order.refund.not_completed": "退款未完成",
  "order.idempotency_key_conflict": "请求重复，请勿重复提交",
  "order.system_busy": "系统繁忙，请稍后重试",
  "order.close_failed": "订单关闭失败",
  "order.recharge.invalid_param": "充值参数无效",
  "order.recharge.not_found": "充值订单不存在",
  "order.recharge.amount_mismatch": "充值金额不匹配",

  // ========== 支付相关 (PayErrorCode) ==========
  "pay.callback_failed": "支付回调处理失败",
  "pay.amount_mismatch": "支付金额不匹配",
  "pay.trade_type_required": "请选择支付方式",
  "pay.unsupported_trade_type": "不支持的支付方式",
  "pay.pay_data_generation_failed": "支付数据生成失败，请稍后重试",
  "pay.apple_disabled": "苹果支付暂不可用",
  "pay.wechat_disabled": "微信支付暂不可用",
  "pay.close.invalid_request": "订单关闭请求无效",

  // ========== 账户相关 (AccountErrorCode) ==========
  "account.invalid_param": "参数无效",
  "account.user_id_required": "用户ID不能为空",
  "account.update_failed": "账户信息更新失败",
  "account.insufficient_balance": "余额不足",
  "account.reservation_not_found": "资金预占记录不存在",
  "account.admin_sms_invalid": "充值短信验证码无效",
  "account.withdraw.not_found": "提现记录不存在",
  "account.withdraw.unknown_destination": "未知的提现目标",
  "account.withdraw.already_completed": "提现已完成",
  "account.withdraw.not_completed": "提现未完成",
  "account.withdraw.insufficient_balance": "余额不足",
  "account.withdraw.not_pending": "提现记录不在待审核状态",
  "account.withdraw.idempotency_key_conflict": "请求重复，请勿重复提交",

  // ========== 产品相关 (ProductErrorCode) ==========
  "product.metadata_not_found": "产品版本不存在",
  "product.delete_failed": "产品删除失败",
  "product.version_already_exists": "产品版本已存在",
  "product.not_found": "产品不存在",
  "product.not_sellable": "产品已下架或不可购买",
  "product.invalid_status": "产品状态异常",

  // ========== 套餐相关 (SubscriptionErrorCode) ==========
  "package.change_password_failed": "修改密码失败",
  "package.package_not_found": "套餐不存在",
  "package.context_error": "上下文错误",
  "package.username_already_exists": "账号已存在",
  "package.user_id_required": "用户ID不能为空",
  "package.package_id_required": "套餐ID不能为空",
  "package.missing_username": "账号不能为空",
  "package.id_required": "ID不能为空",
  "package.id_mismatch": "ID不匹配",
  "package.line_binding_limit_exceeded": "线路绑定数量已达上限",
  "package.line_binding_game_required": "请选择要绑定的应用",
  "package.line_binding_line_invalid": "绑定的线路无效",
  "package.line_binding_duplicate": "该线路已绑定，请勿重复绑定",
  "package.line_binding_not_found": "线路绑定关系不存在",
  "package.line_binding_in_use": "线路绑定使用中，无法操作",
  "package.line_binding_request_invalid": "线路绑定请求无效",
  "package.line_binding_dependency_unavailable": "依赖服务暂不可用，请稍后重试",
  "package.line_binding_internal_error": "线路绑定处理失败，请稍后重试",

  // ========== 客户端相关 (ClientErrorCode) ==========
  "client.user_expire": "账号已过期，请续费后使用",
  "client.user_game_not_bound": "请先绑定应用",
  "client.ip_apply_too_frequent": "换IP过于频繁，请稍后再试",
  "client.usage_full": "在线设备数已满",
  "client.no_ip_available": "暂无可用IP，请稍后重试",
  "client.device_id_required": "设备ID不能为空",

  // ========== 线路相关 (LineErrorCode) ==========
  "line.not_found": "线路不存在",
  "line.refresh_failed": "线路刷新失败",
  "line.redial_failed": "线路重拨失败，请稍后再试",
  "line.server_not_exist": "线路服务器不存在",
  "line.create_failed": "线路创建失败",
  "line.city_not_found": "城市不存在",
  "line.province_not_found": "省份不存在",
  "line.server_not_found": "服务器不存在",
  "line.update_failed": "线路更新失败",
  "line.delete_failed": "线路删除失败",
  "line.line_id_required": "线路ID不能为空",
  "line.server_group_not_found": "服务器组不存在",

  // ========== 客户端版本相关 (ClientVersionErrorCode) ==========
  "client_version.version_conflict": "版本信息冲突，请刷新后重试",
  "client_version.modify_failed": "版本信息修改失败",

  // ========== 资金相关 (FundsErrorCode) ==========
  "funds.recharge.invalid_param": "充值参数无效",
  "funds.invalid_recharge_param": "充值短信验证码无效",
  "funds.recharge.not_found": "充值订单不存在",
  "funds.recharge.amount_mismatch": "充值金额不匹配",
  "funds.recharge.idempotency_key_conflict": "请求重复，请勿重复提交",
  "funds.commission_context_unavailable": "佣金服务暂不可用，请稍后重试",
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
