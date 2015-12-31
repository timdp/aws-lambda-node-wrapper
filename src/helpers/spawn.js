'use strict'

import {spawn} from 'child_process'

export default (cmd, args) => new Promise((resolve, reject) => {
  const handle = spawn(cmd, args)
  let stdout = ''
  let stderr = ''
  handle.stdout.on('data', data => stdout += '' + data)
  handle.stderr.on('data', data => stderr += '' + data)
  handle.on('close', code => {
    if (code !== 0) {
      reject(new Error(`Process exited with status ${code}`))
    } else {
      resolve(stdout)
    }
  })
})
