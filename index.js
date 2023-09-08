import App from './server.js'
import 'dotenv/config'

App.listen(process.env.PORT, () => {
  console.log(`Ethermap listening for connections on port ${process.env.PORT}`)
})
