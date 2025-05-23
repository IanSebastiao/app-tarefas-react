import { useEffect, useState } from "react";
import api from "../api/api";
import CadastroTarefa from "./CadastroTarefa";

const ListaTarefas = () => {
    const [tarefas, setTarefas] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const carregarTarefas = () => {
        api.get('/tarefas/').then(res => {
            console.log(res)
            setTarefas(res.data);
        });
    };

    useEffect(() => {
        api.get('/tarefas/').then(res => {
            setTarefas(res.data.results || res.data);
        });
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/tarefas/${id}/`);
            setTarefas(prevTarefas => prevTarefas.filter(tarefa => tarefa.id !== id));
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    };

    const handleEditClick = (tarefa) => {
        setTarefaEditando(tarefa.id);
        setTarefaAtualizada({
            nome: tarefa.nome,
            descricao: tarefa.descricao,
            status: tarefa.status,
            dataInicio: tarefa.dataInicio,
            dataFim: tarefa.dataFim,
        });
    };

    return (
        <div >
            <button
                className="btn btn-success mb-3"
                onClick={() => setMostrarFormulario(prev => !prev)
                }
            >
                {mostrarFormulario ? 'Fechar Formulario' : 'Nova Tarefa'}
            </button>
            {mostrarFormulario && (
                <CadastroTarefa onTarefaCadastrada={carregarTarefas} />
            )}
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Titulo</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Status</th>                        
                        <th scope="col">Data Inicio</th>
                        <th scope="col">Data Fim</th>
                        <th scope="col">Ação</th>

                    </tr>
                </thead>
                <tbody>
                    {tarefas.map((tarefa, indice) => (
                        <tr key={tarefa.id}>
                            <th scope="row">{indice + 1}</th>
                            <td>{tarefa.nome}</td>
                            <td>{tarefa.descricao}</td>
                            <td>{tarefa.status}</td>
                            <td>{tarefa.dataInicio ? tarefa.dataInicio.split('T')[0].split('-').reverse().join('/'): ''}</td>
                            <td>{tarefa.dataFim ? tarefa.dataFim.split('T')[0].split('-').reverse().join('/'): ''}</td>
                            <td>
                                <button type="button" className="btn">
                                    <i className="bi bi-pencil-square text-light"></i>
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => handleDelete(tarefa.id)}>
                                    <i className="bi bi-trash text-light"></i>
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
};

export default ListaTarefas