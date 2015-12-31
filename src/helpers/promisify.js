'use strict'

export default func => {
  return (...args) => new Promise((resolve, reject) => {
    const cb = (err, res) => err ? reject(err) : resolve(res)
    func.apply(null, args.concat([cb]))
  })
}
