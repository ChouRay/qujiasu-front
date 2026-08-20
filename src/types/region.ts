// 城市类型定义
export interface City {
  id: number;          // 城市ID
  isEnable: number;    // 是否可用 1：可用，0：不可用
  lineNum: number;     // 可用线路数量
  cname: string;       // 城市名称
  pid: number;         // 所属省份ID
}

// 省份类型定义
export interface Province {
  id: number;          // 省份ID
  isEnable: number;    // 是否可用 1：可用，0：不可用
  cities: City[];      // 城市列表
  pname: string;       // 省份名称
}
