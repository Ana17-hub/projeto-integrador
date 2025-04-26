import { randomUUID } from 'crypto'

export interface ProdutoProps {
    nomeProduto: string;
    codigoBarras?: string;
    descricao: string;
    quantidadeEstoque: number;
    categoria: string;
    categoriaOutro?: string;
    dataValidade?: string;
    imagemUrl?: string;
}

export class Produto {
    id: string;
    nomeProduto: string;
    codigoBarras?: string;
    descricao: string;
    quantidadeEstoque: number;
    categoria: string;
    categoriaOutro?: string;
    dataValidade?: string;
    imagemUrl?: string;

    constructor(props: ProdutoProps) {
        this.id = randomUUID()
        Object.assign(this, props)
    }
}
