import React, {useEffect, useState} from 'react';
import InputMask from 'react-input-mask';
import api from '../service/api';
import './FornecedorForm.css';

interface FormData {
    nomeEmpresa: string;
    cnpj: string;
    endereco: string;
    telefone: string;
    email: string;
    contatoPrincipal: string;
}

const initialData: FormData = {
    nomeEmpresa: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    contatoPrincipal: ''
};

interface FornecedorFormProps {
    editId?: string;
    onSaved?: () => void;
}


const FornecedorForm: React.FC<FornecedorFormProps> = ({ editId, onSaved }) => {
    const [form, setForm] = useState<FormData>(initialData);
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [message, setMessage] = useState<string>('');

    const validate = (): boolean => {
        const errs: Partial<FormData> = {};
        if (!form.nomeEmpresa.trim()) errs.nomeEmpresa = 'Nome da empresa é obrigatório.';
        if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(form.cnpj)) errs.cnpj = 'CNPJ inválido.';
        if (!form.endereco.trim()) errs.endereco = 'Endereço é obrigatório.';
        if (!/^\(\d{2}\) \d{4}-\d{4}$/.test(form.telefone)) errs.telefone = 'Telefone inválido.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'E-mail inválido.';
        if (!form.contatoPrincipal.trim()) errs.contatoPrincipal = 'Contato principal é obrigatório.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    useEffect(() => {
        if (editId) {
            api.get(`/fornecedores/${editId}`)
                .then(res => setForm(res.data))
                .catch(() => setMessage('Erro ao carregar fornecedor.'));
        }
    }, [editId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (editId) {
                // modo edição
                await api.put(`/fornecedores/${editId}`, form);
                setMessage('Fornecedor atualizado com sucesso!');
            } else {
                // modo criação
                await api.post('/fornecedores', form);
                setMessage('Fornecedor cadastrado com sucesso!');
            }
            setForm(initialData);
            onSaved?.();      // avisa o pai pra sair do modo edição
        } catch (err: any) {
            if (err.response?.status === 409) {
                setMessage('Fornecedor com esse CNPJ já está cadastrado!');
            } else {
                setMessage('Erro ao salvar fornecedor.');
            }
        }
    };

    return (
        <div className="form-container">
            <h1>Cadastro de Fornecedor</h1>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label>Nome da Empresa</label>
                    <input
                        type="text"
                        name="nomeEmpresa"
                        placeholder="Insira o nome da empresa"
                        value={form.nomeEmpresa}
                        onChange={handleChange}
                    />
                    {errors.nomeEmpresa && <span className="error">{errors.nomeEmpresa}</span>}
                </div>
                <div className="form-group">
                    <label>CNPJ</label>
                    <InputMask
                        mask="99.999.999/9999-99"
                        name="cnpj"
                        placeholder="00.000.000/0000-00"
                        value={form.cnpj}
                        onChange={handleChange}
                    />
                    {errors.cnpj && <span className="error">{errors.cnpj}</span>}
                </div>
                <div className="form-group">
                    <label>Endereço</label>
                    <textarea
                        name="endereco"
                        placeholder="Insira o endereço completo da empresa"
                        value={form.endereco}
                        onChange={handleChange}
                    />
                    {errors.endereco && <span className="error">{errors.endereco}</span>}
                </div>
                <div className="form-group">
                    <label>Telefone</label>
                    <InputMask
                        mask="(99) 9999-9999"
                        name="telefone"
                        placeholder="(00) 0000-0000"
                        value={form.telefone}
                        onChange={handleChange}
                    />
                    {errors.telefone && <span className="error">{errors.telefone}</span>}
                </div>
                <div className="form-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="exemplo@fornecedor.com"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label>Contato Principal</label>
                    <input
                        type="text"
                        name="contatoPrincipal"
                        placeholder="Nome do contato principal"
                        value={form.contatoPrincipal}
                        onChange={handleChange}
                    />
                    {errors.contatoPrincipal && <span className="error">{errors.contatoPrincipal}</span>}
                </div>
                <button type="submit">Cadastrar</button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default FornecedorForm;
