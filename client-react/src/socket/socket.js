
import io from 'socket.io-client'
import { host } from '../utils/APIRoutes'

const ws = io(host, { transports: ["websocket"] })

export default ws

