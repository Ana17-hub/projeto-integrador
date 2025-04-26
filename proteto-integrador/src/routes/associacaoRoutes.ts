import {Router, Request, Response} from 'express'
import db from '../database/lowdb'

const associacaoRoutes = Router()

// Listar fornecedores de um produto
associacaoRoutes.get('/:produtoId/fornecedores', async (req: Request<{ produtoId: string }>, res: Response) => {
    await db.read()
    const { produtoId } = req.params
    const assoc = db.data!.associacoes.filter(a => a.produtoId === produtoId)
    const fornecedores = assoc
        .map(a => db.data!.fornecedores.find(f => f.id === a.fornecedorId))
        .filter(Boolean)
    res.json(fornecedores)
})

// Associar fornecedor a produto
associacaoRoutes.post<{ produtoId: string; fornecedorId: string }>(
    '/:produtoId/fornecedores/:fornecedorId',
    async (req, res, next) => {
        try {
            await db.read()
            const { produtoId, fornecedorId } = req.params

            if (!db.data!.produtos.find(x => x.id === produtoId)) {
                res.status(404).json({ error: 'Produto não existe' })
                return
            }
            if (!db.data!.fornecedores.find(x => x.id === fornecedorId)) {
                res.status(404).json({ error: 'Fornecedor não existe' })
                return
            }
            if (
                db.data!.associacoes.some(
                    a => a.produtoId === produtoId && a.fornecedorId === fornecedorId
                )
            ) {
                res.status(409).json({ error: 'Já associado' })
                return
            }

            db.data!.associacoes.push({ produtoId, fornecedorId })
            await db.write()
            res.status(201).json({ produtoId, fornecedorId })
        } catch (err) {
            next(err)
        }
    }
)



// Desassociar fornecedor de produto
associacaoRoutes.delete('/:produtoId/fornecedores/:fornecedorId', async(
    req: Request<{ produtoId: string; fornecedorId: string }>,
    res: Response
) => {
    await db.read()
    const { produtoId, fornecedorId } = req.params
    db.data!.associacoes = db.data!.associacoes.filter(
        a => !(a.produtoId === produtoId && a.fornecedorId === fornecedorId)
    )
    await db.write()
    res.status(204).send()
})

export default associacaoRoutes
