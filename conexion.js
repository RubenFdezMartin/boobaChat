import express from 'express'
import logger from 'morgan'
import path from 'path'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config() // Cargar las variables de entorno desde el archivo .env

const port = process.env.PORT ?? 3000

const app = express() // Creamos la app de express ...
const server = createServer(app) // ... y creamos el servidor http utilizando la app de express ...
const io = new Server(server, {
  connectionStateRecovery: {}
}) // ... y dentro de este servidor, creamos nuestro servidor de io (in/out)

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

async function setupDatabase () {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messagesWithUser (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        username TEXT
      )
    `)
  } catch (error) {
    console.error('Error setting up the database:', error)
  }
}

setupDatabase() // Configuramos la base de datos antes de que empiece el servidor

// Agregar esta parte en el bloque de conexión del socket
io.on('connection', async (socket) => {
  console.log('A user has connected!')

  // Cargar mensajes al conectarse
  socket.on('load messages', async () => {
    console.log('Loading messages for the connected user...')
    try {
      const results = await db.execute('SELECT id, content, username FROM messagesWithUser')
      console.log('Messages retrieved:', results.rows)
      results.rows.forEach(row => {
        socket.emit('CHAT_MESSAGE', row.content, row.id.toString(), row.username)
      })
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  })

  socket.on('chat message', async (msg) => {
    let result
    // No siempre es necesario pasar por parámetro los valores [ socket.on('chat message', async (msg, username) => {) ...etc ]
    // porque a veces, como en este caso username, los recibes de index.html [ el auth de la const socket ]
    const username = socket.handshake.auth.username ?? 'anonymous'
    try {
      result = await db.execute({
        sql: 'INSERT INTO messagesWithUser (content, username) VALUES (:contenidoDelMensaje, :username)',
        args: { contenidoDelMensaje: msg, username }
      })
    } catch (e) {
      console.error(e)
      return
    }
    // lo ideal sería que refactorizemos todo esto en objetos para que sea mucho más extensible...
    io.emit('CHAT_MESSAGE', msg, result.lastInsertRowid?.toString(), username)
  })
})

app.use(logger('dev')) // Configuración de middleware
app.use(express.static(path.join(process.cwd()))) // decirle a Express que sirva los archivos estáticos desde la raíz del proyecto

// Definición de rutas
app.get('/', (req, res) => {
  const filePath = path.join(process.cwd(), 'client', 'index.html')
  res.sendFile(filePath) // Enviar el archivo como respuesta
})

// Función para iniciar el servidor
const startServer = () => {
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

export default startServer
