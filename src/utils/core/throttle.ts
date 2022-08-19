export function throttle<T extends unknown[]>(callback: (...args: T) => unknown, wait = 0) {
  // 之前的时间戳
  let oldTime = 0;
  return function (this: unknown, ...args: T) {
    // 获取当前时间戳
    let nowTime = new Date().valueOf();
    //如果现在的时间和以前的时间间隔大于等待的时间
    if (nowTime - oldTime > wait) {
      // 立即执行
      callback.apply(this, args);
      oldTime = nowTime;
    }
  };
}
