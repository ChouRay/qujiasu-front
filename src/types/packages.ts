export interface GameDTO {
  id: number
  name: string
  pname: string
  status: 'DISABLED' | 'ENABLED'
}

export interface SubscriptionLineBindingDTO {
  id: number
  subscriptionId: number
  gameId: number
  metadataId: number
  serverGroupId: number
  serverId: number
  serverLineId: number
  gmtCreate: string
  gmtModified: string
}

export interface SubscriptionConfigVO {
  packageId: number
  gameInfo: GameDTO
  locationList: number[]
  lineBindings: SubscriptionLineBindingDTO[]
}

export interface SubscriptionVO {
  id: number
  metadataId: number
  name: string
  usageCount: number
  usingCount: number
  gmt_create: string
  dateOffline: string
  username: string
  password: string
  status: 'OK' | 'FROZEN'
  config: SubscriptionConfigVO
}

export interface PackagesResponse {
  pageNum: number
  pageSize: number
  totalNum: number
  data: SubscriptionVO[]
  timestamp: string
}
