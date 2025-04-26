import React, { useEffect, useState } from 'react';
import api from '../service/api';

interface Produto {
    id: string;
    nomeProduto: string;
}

interface Props {
    onSelect: (id: string) => void;
}

const ProductDropdown: React.FC<Props> = ({ onSelect }) => {
    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        api.get<Produto[]>('/produtos').then(res => setProdutos(res.data));
    }, []);

    return (
        <div className="dropdown-container">
            <h2>Selecione um produto</h2>
            <select onChange={e => onSelect(e.target.value)} defaultValue="">
                <option value="" disabled>-- Escolha um produto --</option>
                {produtos.map(p => (
                    <option key={p.id} value={p.id}>
                        {p.nomeProduto}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProductDropdown;
