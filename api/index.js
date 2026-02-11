// const app = require('../main') // 引入根目录的 app.js

// // 这一步是为了适配 Vercel 的 Serverless 环境
// module.exports = (req, res) => {
//   // 某些版本的 API 需要手动设置 cookie 保存路径（虽然 Vercel 还是写不了，但能防止崩溃）
//   // 这里其实主要是为了导出一个函数给 Vercel 调用
//   return app(req, res)

// }

const fs = require('fs')
const path = require('path')
const os = require('os')
const { app } = require('../main')

module.exports = async (req, res) => {
  try {
    // 1. 手动修复：在运行前确保 /tmp/anonymous_token 存在
    const tmpPath = os.tmpdir()
    const tokenPath = path.resolve(tmpPath, 'anonymous_token')

    if (!fs.existsSync(tokenPath)) {
      fs.writeFileSync(tokenPath, '', 'utf-8')
    }

    // 2. 调用主程序
    if (typeof app === 'function') {
      return app(req, res)
    }

    res.status(500).send('Server Error: app instance not found')
  } catch (err) {
    console.error('Entry error:', err)
    res.status(500).send(err.message)
  }
}
