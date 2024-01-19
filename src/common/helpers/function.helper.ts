export const sleep = async (time: number) => {
  await new Promise((resolve) => setTimeout(resolve, time))
}

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout> | null

  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, delay)
  }
}

export const throttle = (func: (...args: any[]) => void, delay: number) => {
  let lastCall = 0

  return function (...args: any[]) {
    const now = new Date().getTime()

    if (now - lastCall >= delay) {
      lastCall = now
      return func(...args)
    }
  }
}

export const debounceAsync = (func: (...args: any[]) => Promise<any>, delay: number) => {
  let state = 0

  return async (...args: any[]): Promise<any> => {
    state++
    const current = state
    await sleep(delay)
    if (current !== state) return null // Hiểu đơn giản là sau khi ngủ dậy thì thấy thằng khác cướp mất state rồi
    return await func(...args)
  }
}

export const throttleAsync = (func: (...args: any[]) => Promise<any>, delay: number) => {
  let state = 0

  return async (...args: any[]): Promise<any> => {
    if (state !== 0) return null // Hiểu đơn giản là state đang bị thằng khác xử lý rồi
    state++
    await sleep(delay)
    const result = await func(...args)
    state = 0 // Xử lý xong mới nhả state ra
    return result
  }
}
