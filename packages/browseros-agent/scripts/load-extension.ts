const [extPath, cdpPort = '9000'] = process.argv.slice(2)

const info = await fetch(`http://127.0.0.1:${cdpPort}/json/version`).then((r) =>
  r.json(),
)
const ws = new WebSocket(info.webSocketDebuggerUrl)

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      id: 1,
      method: 'Extensions.loadUnpacked',
      params: { path: extPath },
    }),
  )
}

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data as string)
  if (msg.id === 1) {
    if (msg.error) {
      console.error('FAIL:' + JSON.stringify(msg.error))
      process.exit(1)
    } else {
      console.log('OK:' + msg.result.id)
      process.exit(0)
    }
  }
}

ws.onerror = (err) => {
  console.error('WS_ERR:' + (err as ErrorEvent).message)
  process.exit(1)
}

setTimeout(() => {
  console.error('TIMEOUT')
  process.exit(1)
}, 10000)
