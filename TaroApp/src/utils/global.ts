/**
 * 全局变量定义文件
 * 如果项目简单,使用此文件来get/set全局变量
 * 如果项目复杂,使用redux来做数据状态管理
 */
const globalData = {}

export function set (key, val) {
  globalData[key] = val
}

export function get (key) {
  return globalData[key]
}

// 在其他位置引用时,示例如下
// import { set as setGlobalData, get as getGlobalData } from './path/name/global_data'

// setGlobalData('test', 1)

// getGlobalData('test')
