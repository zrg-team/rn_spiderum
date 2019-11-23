export function wait (time = 0, process) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      if (process) {
        await process()
      }
      resolve(true)
    }, time)
  })
}
