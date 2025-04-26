import { Router, Request, Response, NextFunction } from 'express'
import db from '../database/lowdb'
import { Fornecedor, FornecedorProps } from '../entities/Fornecedor'

const fornecedorRoutes = Router()

fornecedorRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await db.read()
        res.json(db.data!.fornecedores)
    } catch (err) {
        next(err)
    }
})

fornecedorRoutes.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        await db.read()
        const f = db.data!.fornecedores.find(x => x.id === req.params.id)
        if (!f) {
            res.status(404).json({ error: 'Fornecedor não encontrado' })
            return
        }
        res.json(f)
    } catch (err) {
        next(err)
    }
})

fornecedorRoutes.post('/', async (req: Request<{}, {}, FornecedorProps>, res: Response, next: NextFunction) => {
    try {
        await db.read()
        const fornecedor = new Fornecedor(req.body)
        db.data!.fornecedores.push(fornecedor)
        await db.write()
        res.status(201).json(fornecedor)
    } catch (err) {
        next(err)
    }
})

// Atualizar um fornecedor existente
fornecedorRoutes.put<{ id: string }, any, Partial<FornecedorProps>>(
    '/:id',
    async (req, res, next) => {
        try {
            await db.read()
            const idx = db.data!.fornecedores.findIndex(x => x.id === req.params.id)
            if (idx < 0) {
                res.status(404).json({ error: 'Fornecedor não encontrado' })
                return
            }
            db.data!.fornecedores[idx] = { ...db.data!.fornecedores[idx], ...req.body }
            await db.write()
            res.json(db.data!.fornecedores[idx])
        } catch (err) {
            next(err)
        }
    }
)

fornecedorRoutes.delete('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        await db.read()
        db.data!.fornecedores = db.data!.fornecedores.filter(x => x.id !== req.params.id)
        await db.write()
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

export default fornecedorRoutes
