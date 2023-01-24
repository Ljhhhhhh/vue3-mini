export const isObject = (value: unknown) =>
  value !== null && typeof value === 'object'

/**
 * 对比两个数据是否发生了改变
 */
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

/**
 * 是否为一个 function
 */
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
