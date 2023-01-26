// 对应 promise 的 pending 状态
let isFlushPending = false

const resolvePromise = Promise.resolve() as Promise<any>

let currentFlushPromise: Promise<void> | null = null

// 待执行的任务队列
const pendingPreFlushCbs: Function[] = []

// 队列预处理函数
export function queuePreFlushCb(cb: Function) {
  queueCb(cb, pendingPreFlushCbs)
}

// 队列预处理函数
function queueCb(cb: Function, pendingQueue: Function[]) {
  // 将所有的回调函数放入队列中
  pendingQueue.push(cb)
  queueFlush()
}

// 依次处理队列中执行函数
function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvePromise.then(flushJobs)
  }
}

// 处理队列
function flushJobs() {
  isFlushPending = false
  flushPreFlushCbs()
}

// 依次处理队列中的人物
export function flushPreFlushCbs() {
  if (pendingPreFlushCbs.length) {
    let activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
    pendingPreFlushCbs.length = 0
    for (let i = 0; i < activePreFlushCbs.length; i++) {
      activePreFlushCbs[i]()
    }
  }
}
