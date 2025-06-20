const express = require('express')
const expressWs = require('express-ws')

const app = express()
expressWs(app)

const port = process.env.PORT || 3001
let connects = [] // WebSocket接続を保持する配列

app.use(express.static('public')) // publicフォルダを静的ファイルとして提供

app.ws('/ws', (ws, req) => {
  connects.push(ws) // 新しい接続を配列に追加

  ws.on('message', (message) => {
    console.log('Received:', message)

    // 受信したメッセージを接続している全てのクライアントにブロードキャスト
    connects.forEach((socket) => {
      if (socket.readyState === 1) {
        // WebSocket接続がOPEN状態であることを確認
        socket.send(message)
      }
    })
  })

  ws.on('close', () => {
    // 接続が閉じたら配列から削除
    connects = connects.filter((conn) => conn !== ws)
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})