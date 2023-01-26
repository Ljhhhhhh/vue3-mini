import { ReactiveEffect, isReactive } from '@vue/reactivity'
import { EMPTY_OBJ, hasChanged, isObject } from '@vue/shared'
import { queuePreFlushCb } from './scheduler'
export interface WatchOptions<Immediate = boolean> {
  immediate?: Immediate
  deep?: boolean
}

export function watch(source, cb: Function, options?: WatchOptions) {
  return doWatch(source as any, cb, options)
}

function doWatch(
  source,
  cb: Function,
  { immediate, deep }: WatchOptions = EMPTY_OBJ
) {
  // 触发 source 的数据类型
  let getter: () => any
  if (isReactive(source)) {
    // 指定 getter
    getter = () => source
    deep = true
  } else {
    getter = () => {}
  }

  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let oldValue = {}
  const job = () => {
    if (cb) {
      // watch(source, cb)
      const newValue = effect.run()
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue)
        oldValue = newValue
      }
    }
  }
  // 调度器
  let scheduler = () => queuePreFlushCb(job)
  const effect = new ReactiveEffect(getter, scheduler)

  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}

// 依次执行 getter, 从而触发依赖手机
export function traverse(value: unknown) {
  if (!isObject(value)) {
    return value
  }

  for (const key in value as object) {
    traverse((value as any)[key])
  }

  return value
}
