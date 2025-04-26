import React, { useEffect, useState } from 'react';
import api from '../service/api';
import './AssociationForm.css';

interface Fornecedor {
    id: string;
    nomeEmpresa: string;
    cnpj: string;
}

interface Produto {
    id: string;
    nomeProduto: string;
    codigoBarras?: string;
    descricao: string;
    imagemUrl?: string;
}

interface AssociationFormProps {
    produtoId: string;
}

const AssociationForm: React.FC<AssociationFormProps> = ({ produtoId }) => {
    const [produto, setProduto] = useState<Produto | null>(null);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [selected, setSelected] = useState<string>('');
    const [associados, setAssociados] = useState<Fornecedor[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        async function loadData() {
            try {
                const prodRes = await api.get<Produto>(`/produtos/${produtoId}`);
                setProduto(prodRes.data);
                const fRes = await api.get<Fornecedor[]>('/fornecedores');
                setFornecedores(fRes.data);
                const assocRes = await api.get<Fornecedor[]>(`/associacoes/${produtoId}/fornecedores`);
                setAssociados(assocRes.data);
            } catch {
                setMessage('Erro ao carregar dados.');
            }
        }
        loadData();
    }, [produtoId]);

    const handleAssociate = async () => {
        if (!selected) return;

        try {
            const prodsRes = await api.get<Produto[]>('/produtos');
            const assocPromises = prodsRes.data.map(p =>
                api.get<Fornecedor[]>(`/associacoes/${p.id}/fornecedores`)
            );
            const assocResults = await Promise.all(assocPromises);
            const allAssociated = assocResults
                .flatMap(r => r.data)
                .map(f => f.id);

            // 2) Se o fornecedor já estiver associado a qualquer produto, bloqueia
            if (allAssociated.includes(selected)) {
                setMessage('Fornecedor já está associado a outro produto!');
                return;
            }

            await api.post(`/associacoes/${produtoId}/fornecedores/${selected}`);
            setMessage('Fornecedor associado com sucesso ao produto!');
            const updated = await api.get<Fornecedor[]>(`/associacoes/${produtoId}/fornecedores`);
            setAssociados(updated.data);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setMessage('Fornecedor já está associado a este produto!');
            } else {
                setMessage('Erro ao associar fornecedor.');
            }
        }
    };

    const handleDissociate = async (id: string) => {
        try {
            await api.delete(`/associacoes/${produtoId}/fornecedores/${id}`);
            setMessage('Fornecedor desassociado com sucesso!');
            setAssociados(current => current.filter(f => f.id !== id));
        } catch {
            setMessage('Erro ao desassociar fornecedor.');
        }
    };

    if (!produto) return <div>Carregando detalhes do produto...</div>;

    return (
        <div className="assoc-container">
            <h2>Associação de Fornecedor a Produto</h2>
            <div className="produto-detalhe">
                <h3>{produto.nomeProduto}</h3>
                <p>Código: {produto.codigoBarras}</p>
                <p>{produto.descricao}</p>
                {produto.imagemUrl && <img src={produto.imagemUrl} alt={produto.nomeProduto} className="thumb" />}
            </div>
            <div className="assoc-actions">
                <select value={selected} onChange={e => setSelected(e.target.value)}>
                    <option value="">Selecione um fornecedor</option>
                    {fornecedores.map(f => (
                        <option key={f.id} value={f.id}>{f.nomeEmpresa} ({f.cnpj})</option>
                    ))}
                </select>
                <button onClick={handleAssociate} disabled={!selected}>Associar Fornecedor</button>
            </div>
            <div className="assoc-list">
                <h4>Fornecedores Associados</h4>
                <ul>
                    {associados.map(f => (
                        <li key={f.id}>
                            {f.nomeEmpresa} ({f.cnpj})
                            <button onClick={() => handleDissociate(f.id)}>Desassociar</button>
                        </li>
                    ))}
                </ul>
            </div>
            {message && <div className="assoc-message">{message}</div>}
        </div>
    );
};

export default AssociationForm;
