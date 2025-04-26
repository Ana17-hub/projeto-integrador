import React, { useEffect, useState } from 'react';
import api from '../service/api';
import './FornecedorList.css';

interface Fornecedor { id: string; nomeEmpresa: string; cnpj: string; }
interface FornecedorListProps { onEdit: (id: string) => void; refreshKey: number; }

const FornecedorList: React.FC<FornecedorListProps> = ({ onEdit, refreshKey }) => {
    const [items, setItems] = useState<Fornecedor[]>([]);
    const [associatedSet, setAssociatedSet] = useState<Set<string>>(new Set());
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        async function load() {
            setMessage('');
            try {
                // Load fornecedores
                const fRes = await api.get<Fornecedor[]>('/fornecedores');
                setItems(fRes.data);
                // Load products to determine associations
                const pRes = await api.get<{ id: string }[]>('/produtos');
                // For each product, fetch its associated fornecedores
                const assocPromises = pRes.data.map(p =>
                    api.get<Fornecedor[]>(`/associacoes/${p.id}/fornecedores`)
                );
                const assocResults = await Promise.all(assocPromises);
                const setIds = new Set<string>();
                assocResults.forEach(res => res.data.forEach(f => setIds.add(f.id)));
                setAssociatedSet(setIds);
            } catch {
                setMessage('Erro ao carregar fornecedores.');
            }
        }
        load();
    }, [refreshKey]);

    const handleDelete = async (id: string) => {
        if (associatedSet.has(id)) {
            setMessage('Não é possível excluir fornecedor associado.');
            return;
        }
        try {
            await api.delete(`/fornecedores/${id}`);
            // reload list after deletion
            setItems(prev => prev.filter(f => f.id !== id));
            setMessage('Fornecedor excluído com sucesso!');
        } catch {
            setMessage('Erro ao excluir fornecedor.');
        }
    };

    return (
        <div className="list-container">
            <h2>Fornecedores Cadastrados</h2>
            {message && <div className="error">{message}</div>}
            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>CNPJ</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {items.map(f => (
                    <tr key={f.id}>
                        <td>{f.nomeEmpresa}</td>
                        <td>{f.cnpj}</td>
                        <td>
                            <button onClick={() => onEdit(f.id)}>Editar</button>
                            <button
                                onClick={() => handleDelete(f.id)}
                                disabled={associatedSet.has(f.id)}
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

export default FornecedorList;
