import express, { Router, Request, Response, NextFunction } from 'express'
import db from '../database/lowdb'
import { Produto, ProdutoProps } from '../entities/Produto'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const produtoRoutes = Router()
const upload = multer({ dest: 'uploads/' })

produtoRoutes.use('/uploads', express.static(path.resolve('uploads')))

produtoRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await db.read()
        res.json(db.data!.produtos)
    } catch (err) { next(err) }
})

produtoRoutes.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        await db.read()
        const p = db.data!.produtos.find(x => x.id === req.params.id)
        if (!p) {
            res.status(404).json({ error: 'Produto não encontrado' })
            return
        }
        res.json(p)
    } catch (err) { next(err) }
})

produtoRoutes.post('/', upload.single('imagem'), async (req: Request<{}, {}, Omit<ProdutoProps, 'imagemUrl'>>, res: Response, next: NextFunction) => {
    try {
        await db.read()
        const { nomeProduto, codigoBarras, descricao, quantidadeEstoque, categoria, categoriaOutro, dataValidade } = req.body
        const imagemUrl = req.file ? `/uploads/${req.file.filename}` : undefined
        const produto = new Produto({ nomeProduto, codigoBarras, descricao, quantidadeEstoque: Number(quantidadeEstoque), categoria, categoriaOutro, dataValidade, imagemUrl })
        db.data!.produtos.push(produto)
        await db.write()
        res.status(201).json(produto)
    } catch (err) { next(err) }
})

produtoRoutes.put('/:id', upload.single('imagem'), async (req: Request<{ id: string }, {}, Partial<ProdutoProps>>, res: Response, next: NextFunction) => {
    try {
        await db.read()
        const idx = db.data!.produtos.findIndex(x => x.id === req.params.id)
        if (idx < 0) {
            res.status(404).json({ error: 'Produto não encontrado' })
            return
        }
        const old = db.data!.produtos[idx]
        if (req.file && old.imagemUrl) fs.unlinkSync(path.join('uploads', path.basename(old.imagemUrl)))
        const update: Partial<ProdutoProps> = { ...req.body } as any
        if (req.file) update.imagemUrl = `/uploads/${req.file.filename}`
        update.quantidadeEstoque = update.quantidadeEstoque !== undefined ? Number(update.quantidadeEstoque) : old.quantidadeEstoque
        db.data!.produtos[idx] = { ...old, ...update }
        await db.write()
        res.json(db.data!.produtos[idx])
    } catch (err) { next(err) }
})

produtoRoutes.delete('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        await db.read()
        const p = db.data!.produtos.find(x => x.id === req.params.id)
        if (p?.imagemUrl) fs.unlinkSync(path.join('uploads', path.basename(p.imagemUrl)))
        db.data!.produtos = db.data!.produtos.filter(x => x.id !== req.params.id)
        await db.write()
        res.status(204).send()
    } catch (err) { next(err) }
})

export default produtoRoutes
