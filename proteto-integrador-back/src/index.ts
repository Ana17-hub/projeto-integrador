import express from 'express'
import cors from 'cors'
import path from 'path'

import fornecedorRoutes from './routes/fornecedorRoutes'
import produtoRoutes   from './routes/produtoRoutes'
import associacaoRoutes from './routes/associacaoRoutes'
import db              from './database/lowdb'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.resolve('uploads')))

async function bootstrap() {
    try {
        // Leia e inicialize o banco somente dentro de uma função async
        await db.read()
        await db.write()

        // Monte suas rotas só depois
        app.use('/fornecedores', fornecedorRoutes)
        app.use('/produtos', produtoRoutes)
        app.use('/associacoes', associacaoRoutes)

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`))
    } catch (err) {
        console.error('Erro ao iniciar o servidor:', err)
        process.exit(1)
    }
}

// Chama a função
bootstrap()
