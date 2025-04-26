import { randomUUID } from 'crypto'

export interface FornecedorProps {
    nomeEmpresa: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
    contatoPrincipal: string;
}

export class Fornecedor {
    id: string;
    nomeEmpresa: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
    contatoPrincipal: string;

    constructor(props: FornecedorProps) {
        this.id = randomUUID()
        Object.assign(this, props)
    }
}
