'use strict'

import fs from 'fs'
import path from 'path'
import copy from './helpers/copy'
import spawn from './helpers/spawn'
import promisify from './helpers/promisify'

const NODE_VERSION = 'v4.2.4'
const CHILD_SCRIPT = path.resolve(__dirname, 'child.js')

const chmod = promisify(fs.chmod)
const mkdir = promisify(fs.mkdir)
const rmdir = promisify(fs.rmdir)
const unlink = promisify(fs.unlink)

const startTime = Date.now()

const log = msg => {
  const delta = Date.now() - startTime
  console.info(`[${delta}] ${msg}`)
}

const main = async () => {
  process.env.PATH += ':' + process.env.LAMBDA_TASK_ROOT
  const srcDir = path.resolve(__dirname, `../vendor/node-${NODE_VERSION}-linux-x64/bin`)
  const src = path.join(srcDir, 'node')
  const destDir = '/tmp/node-wrapper-' + Date.now()
  const node = path.join(destDir, 'node')
  try {
    log(`Creating directory: ${destDir}`)
    await mkdir(destDir)
    log(`Copying ${src} to ${node}`)
    await copy(src, node)
    log(`Making ${node} executable`)
    await chmod(node, 0x755)
    log(`Spawning ${CHILD_SCRIPT}`)
    const jsonStr = await spawn(node, [CHILD_SCRIPT])
    log(`Parsing result`)
    const res = JSON.parse(jsonStr)
    log(`Parse completed`)
    return res
  } finally {
    log(`Cleaning up`)
    await unlink(node)
    await rmdir(destDir)
  }
}

export const handler = (event, context) => {
  log(`Starting`)
  main().then(res => {
    log('Completed: ' + JSON.stringify(res))
    context.succeed(res)
  }, err => {
    log(`Error: ${err}`)
    context.fail(err)
  })
}
