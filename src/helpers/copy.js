'use strict'

import fs from 'fs'

export default (src, dest) => new Promise((resolve, reject) => {
  let called = false
  const done = err => {
    if (called) {
      return
    }
    called = true
    if (err) {
      reject(err)
    } else {
      resolve()
    }
  }
  const rd = fs.createReadStream(src)
  rd.on('error', done)
  const wr = fs.createWriteStream(dest)
  wr.on('error', done)
  wr.on('close', () => done())
  rd.pipe(wr)
})
