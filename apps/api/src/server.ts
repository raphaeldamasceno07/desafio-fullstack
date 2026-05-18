import { app } from './app'

const docLink = 'http://localhost:3333/docs'
app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('Server is running on http://localhost:3333')
    console.log(`Docs are available at ${docLink}`)
  })
  .catch(err => {
    console.error('Erro ao iniciar a API:', err)
    process.exit(1)
  })
