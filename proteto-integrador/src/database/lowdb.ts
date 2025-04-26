import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { Fornecedor } from '../entities/Fornecedor'
import { Produto } from '../entities/Produto'

type Data = {
    fornecedores: Fornecedor[];
    produtos: Produto[];
    associacoes: { produtoId: string; fornecedorId: string }[];
}

const adapter = new JSONFile<Data>('db.json')
const db = new Low<Data>(adapter, { fornecedores: [], produtos: [], associacoes: [] })

export default db
