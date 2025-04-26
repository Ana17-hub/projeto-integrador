import React, { useEffect, useState } from 'react';
import api from '../service/api';
import './ProductList.css';

interface Produto { id: string; nomeProduto: string; codigoBarras?: string; quantidadeEstoque: number; }
interface ProductListProps { onEdit: (id: string) => void; refreshKey: number; }

const ProductList: React.FC<ProductListProps> = ({ onEdit, refreshKey }) => {
    const [items, setItems] = useState<Produto[]>([]);
    const [associatedSet, setAssociatedSet] = useState<Set<string>>(new Set());
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        async function load() {
            setMessage('');
            try {
                // Load produtos
                const pRes = await api.get<Produto[]>('/produtos');
                setItems(pRes.data);
                // Determine associated suppliers for each product
                const assocPromises = pRes.data.map(prod =>
                    api.get<{ id: string }[]>(`/associacoes/${prod.id}/fornecedores`)
                );
                const assocResults = await Promise.all(assocPromises);
                const setIds = new Set<string>();
                assocResults.forEach(res => res.data.forEach(f => setIds.add(f.id)));
                setAssociatedSet(setIds);
            } catch {
                setMessage('Erro ao carregar produtos.');
            }
        }
        load();
    }, [refreshKey]);

    const handleDelete = async (id: string) => {
        if (associatedSet.has(id)) {
            setMessage('Não é possível excluir produto associado.');
            return;
        }
        try {
            await api.delete(`/produtos/${id}`);
            setItems(prev => prev.filter(p => p.id !== id));
            setMessage('Produto excluído com sucesso!');
        } catch {
            setMessage('Erro ao excluir produto.');
        }
    };

    return (
        <div className="list-container">
            <h2>Produtos Cadastrados</h2>
            {message && <div className="error">{message}</div>}
            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Código de Barras</th>
                    <th>Qtd. Estoque</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {items.map(p => (
                    <tr key={p.id}>
                        <td>{p.nomeProduto}</td>
                        <td>{p.codigoBarras}</td>
                        <td>{p.quantidadeEstoque}</td>
                        <td>
                            <button onClick={() => onEdit(p.id)}>Editar</button>
                            <button
                                onClick={() => handleDelete(p.id)}
                                disabled={associatedSet.has(p.id)}
                            >
                                Excluir
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default ProductList;
