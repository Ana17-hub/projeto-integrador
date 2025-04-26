// src/components/ProductForm.tsx
import React, {useEffect, useState} from 'react';
import api from '../service/api';
import './ProductForm.css';

interface ProductFormData {
    nomeProduto: string;
    codigoBarras: string;
    descricao: string;
    quantidadeEstoque: string;
    categoria: string;
    categoriaOutro: string;
    dataValidade: string;
    imagemFile: File | null;
}

const initialState: ProductFormData = {
    nomeProduto: '',
    codigoBarras: '',
    descricao: '',
    quantidadeEstoque: '',
    categoria: 'Eletrônicos',
    categoriaOutro: '',
    dataValidade: '',
    imagemFile: null
};

const categorias = [
    'Eletrônicos',
    'Alimentos',
    'Vestuário',
    'Outro'
];

interface ProductFormProps {
    editId?: string;
    onSaved?: () => void;
}


const ProductForm: React.FC<ProductFormProps> = ({ editId, onSaved }) => {
    const [form, setForm] = useState<ProductFormData>(initialState);
    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
    const [message, setMessage] = useState<string>('');

    const validate = (): boolean => {
        const errs: Partial<Record<keyof ProductFormData, string>> = {};
        if (!form.nomeProduto.trim()) errs.nomeProduto = 'Nome do produto é obrigatório.';
        if (!/^[0-9]+$/.test(form.codigoBarras)) errs.codigoBarras = 'Código de barras inválido.';
        if (!form.descricao.trim()) errs.descricao = 'Descrição é obrigatória.';
        if (!/^[0-9]+$/.test(form.quantidadeEstoque)) errs.quantidadeEstoque = 'Quantidade inválida.';
        if (!form.categoria) errs.categoria = 'Categoria é obrigatória.';
        if (form.categoria === 'Outro' && !form.categoriaOutro.trim())
            errs.categoriaOutro = 'Especifique a categoria.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    useEffect(() => {
        if (editId) {
            api.get(`/produtos/${editId}`)
                .then(res => {
                    setForm({
                        nomeProduto: res.data.nomeProduto,
                        codigoBarras: res.data.codigoBarras || '',
                        descricao: res.data.descricao,
                        quantidadeEstoque: String(res.data.quantidadeEstoque),
                        categoria: res.data.categoria,
                        categoriaOutro: res.data.categoriaOutro || '',
                        dataValidade: res.data.dataValidade || '',
                        imagemFile: null
                    });
                    setMessage('');
                })
                .catch(() => setMessage('Erro ao carregar produto.'));
        } else {
            setForm(initialState);
            setMessage('');
        }
    }, [editId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (name === 'imagemFile' && files) {
            setForm(prev => ({ ...prev, imagemFile: files[0] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const data = new FormData();
        data.append('nomeProduto', form.nomeProduto);
        data.append('codigoBarras', form.codigoBarras);
        data.append('descricao', form.descricao);
        data.append('quantidadeEstoque', form.quantidadeEstoque);
        data.append('categoria', form.categoria);
        if (form.categoria === 'Outro') data.append('categoriaOutro', form.categoriaOutro);
        if (form.dataValidade) data.append('dataValidade', form.dataValidade);
        if (form.imagemFile) data.append('imagem', form.imagemFile);

        try {
            if (editId) {
                await api.put(`/produtos/${editId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage('Produto atualizado com sucesso!');
            } else {
                await api.post('/produtos', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage('Produto cadastrado com sucesso!');
            }
            setForm(initialState);
            onSaved?.();
        } catch (err: any) {
            if (err.response?.status === 409) {
                setMessage('Produto com este código de barras já está cadastrado!');
            } else {
                setMessage('Erro ao salvar produto.');
            }
        }
    };

    return (
        <div className="product-form-container">
            <h1>Cadastro de Produto</h1>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label>Nome do Produto</label>
                    <input
                        type="text"
                        name="nomeProduto"
                        placeholder="Insira o nome do produto"
                        value={form.nomeProduto}
                        onChange={handleChange}
                    />
                    {errors.nomeProduto && <span className="error">{errors.nomeProduto}</span>}
                </div>

                <div className="form-group">
                    <label>Código de Barras</label>
                    <input
                        type="text"
                        name="codigoBarras"
                        placeholder="Insira o código de barras"
                        value={form.codigoBarras}
                        onChange={handleChange}
                    />
                    {errors.codigoBarras && <span className="error">{errors.codigoBarras}</span>}
                </div>

                <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                        name="descricao"
                        placeholder="Descreva brevemente o produto"
                        value={form.descricao}
                        onChange={handleChange}
                    />
                    {errors.descricao && <span className="error">{errors.descricao}</span>}
                </div>

                <div className="form-group">
                    <label>Quantidade em Estoque</label>
                    <input
                        type="number"
                        name="quantidadeEstoque"
                        placeholder="Quantidade disponível"
                        value={form.quantidadeEstoque}
                        onChange={handleChange}
                    />
                    {errors.quantidadeEstoque && <span className="error">{errors.quantidadeEstoque}</span>}
                </div>

                <div className="form-group">
                    <label>Categoria</label>
                    <select name="categoria" value={form.categoria} onChange={handleChange}>
                        {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {errors.categoria && <span className="error">{errors.categoria}</span>}
                </div>

                {form.categoria === 'Outro' && (
                    <div className="form-group">
                        <label>Especifique a Categoria</label>
                        <input
                            type="text"
                            name="categoriaOutro"
                            placeholder="Insira a categoria"
                            value={form.categoriaOutro}
                            onChange={handleChange}
                        />
                        {errors.categoriaOutro && <span className="error">{errors.categoriaOutro}</span>}
                    </div>
                )}

                <div className="form-group">
                    <label>Data de Validade</label>
                    <input
                        type="date"
                        name="dataValidade"
                        value={form.dataValidade}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Imagem do Produto</label>
                    <input
                        type="file"
                        name="imagemFile"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Cadastrar</button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default ProductForm;
