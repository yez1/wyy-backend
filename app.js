#!/usr/bin/env node
// === Vercel 修复代码开始 ===
try {
  const fs = require('fs')
  // 如果 /tmp/anonymous_token 不存在，就创建一个空的
  if (!fs.existsSync('/tmp/anonymous_token')) {
    fs.writeFileSync('/tmp/anonymous_token', '', 'utf-8')
  }
} catch (error) {
  // 忽略错误，防止崩坏
  console.log('创建临时 Token 文件失败', error)
}
// === Vercel 修复代码结束 ===

const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()

async function start() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }
  // 启动时更新anonymous_token
  const generateConfig = require('./generateConfig')
  await generateConfig()
  require('./server').serveNcmApi({
    checkVersion: true,
  })
}
start()
