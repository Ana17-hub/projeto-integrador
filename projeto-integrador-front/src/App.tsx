import React, { useState } from 'react';
import ProductDropdown from './components/ProductDropDown';
import FornecedorForm from './components/FornecedorForm';
import ProductForm from './components/ProductForm';
import AssociationForm from './components/AssociationForm';
import FornecedorList from './components/FornecedorList';
import ProductList from './components/ProductList';
import './App.css';

type Tab = 'fornecedores' | 'produtos' | 'associacao';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('fornecedores');
    const [editFornecedorId, setEditFornecedorId] = useState<string | null>(null);
    const [editProdutoId, setEditProdutoId] = useState<string | null>(null);
    const [refreshFornecedorKey, setRefreshFornecedorKey] = useState(0);
    const [refreshProdutoKey, setRefreshProdutoKey] = useState(0);

    return (
        <div className="app-container">
            <h1>Sistema de Gestão</h1>
            <nav className="menu">
                <button
                    className={activeTab === 'fornecedores' ? 'active' : ''}
                    onClick={() => {
                        setActiveTab('fornecedores');
                        setEditFornecedorId(null);
                    }}
                >
                    Fornecedores
                </button>
                <button
                    className={activeTab === 'produtos' ? 'active' : ''}
                    onClick={() => {
                        setActiveTab('produtos');
                        setEditProdutoId(null);
                    }}
                >
                    Produtos
                </button>
                <button
                    className={activeTab === 'associacao' ? 'active' : ''}
                    onClick={() => {
                        setActiveTab('associacao');
                        setEditProdutoId(null);
                    }}
                >
                    Associação
                </button>
            </nav>

            <div className="content">
                {activeTab === 'fornecedores' && (
                    <>
                        <FornecedorForm
                            editId={editFornecedorId}
                            onSaved={() => {
                                setEditFornecedorId(null);
                                setRefreshFornecedorKey((k) => k + 1);
                            }}
                        />
                        <FornecedorList
                            onEdit={(id) => setEditFornecedorId(id)}
                            refreshKey={refreshFornecedorKey}
                        />
                    </>
                )}

                {activeTab === 'produtos' && (
                    <>
                        <ProductForm
                            editId={editProdutoId}
                            onSaved={() => {
                                setEditProdutoId(null);
                                setRefreshProdutoKey((k) => k + 1);
                            }}
                        />
                        <ProductList
                            onEdit={(id) => setEditProdutoId(id)}
                            refreshKey={refreshProdutoKey}
                        />
                    </>
                )}

                {activeTab === 'associacao' && (
                    <div className="assoc-selector">
                        {!editProdutoId ? (
                            <ProductDropdown onSelect={(id) => setEditProdutoId(id)} />
                        ) : (
                            <>
                                <button className="back-btn" onClick={() => setEditProdutoId(null)}>
                                    ← Selecionar outro produto
                                </button>
                                <AssociationForm produtoId={editProdutoId} />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
