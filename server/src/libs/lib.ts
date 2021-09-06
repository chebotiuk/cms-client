export const once = (fn: null | ((...args: Array<any>) => any)) => (...args: Array<any>) => {
  if (!fn) return
  const res = fn(...args)
  fn = null
  return res
}
