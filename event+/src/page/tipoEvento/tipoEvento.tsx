import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import "./tipoEvento.css";
import type { TipoEvento } from "../../types/api";
import Campo from "../../components/campos/campo";
import Botao from "../../components/botao/botao";
import { tipoEventoService } from "../../service/Eventplusservice";
import { getApiErrormessage } from "../../service/api";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";

import imagemdosnpc from "../../assets/imagemdosnpclegal.svg";

interface FormularioTipoEvento {
    titulo: string;
}

const inicial: FormularioTipoEvento = { titulo: "" };

function TiposEvento() {
    const [formulario, setFormulario] = useState(inicial);
    const [tipos, setTipos] = useState<TipoEvento[]>([]);
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<TipoEvento | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const carregar = useCallback(async () => {
        setCarregando(true);
        setMensagem("");
        try {
            const tiposApi = await tipoEventoService.listar();
            setTipos(tiposApi);
        } catch (error) {
            setMensagem(getApiErrormessage(error));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregar(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregar]);

    function atualizar(event: ChangeEvent<HTMLInputElement>) {
        setFormulario((value) => ({ ...value, [event.target.name]: event.target.value }));
    }

    function limpar() {
        setFormulario(inicial);
        setIdEmEdicao(null);
        setMensagem("");
    }

    async function salvar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setEnviando(true);
        setMensagem("");
        try {
            const payload = {
                titulo: formulario.titulo.trim()
            };

            if (idEmEdicao) await tipoEventoService.atualizar(idEmEdicao, payload);
            else await tipoEventoService.cadastrar(payload);

            limpar();
            await carregar();
        } catch (error) {
            setMensagem(getApiErrormessage(error));
        } finally {
            setEnviando(false);
        }
    }

    function editar(tipo: TipoEvento) {
        setIdEmEdicao(tipo.idtipoEvento);
        setFormulario({ titulo: tipo.titulo });
        setMensagem("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado) return;
        setEnviando(true);

        try {
            await tipoEventoService.deletar(selecionado.idtipoEvento);
            if (idEmEdicao === selecionado.idtipoEvento) limpar();
            setSelecionado(null);
            await carregar();
        } catch (error) {
            setMensagem(getApiErrormessage(error));
            setSelecionado(null);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <>
            <Header />
            <main className="cadastro-tipo-evento-page">
                {/* Seção Superior - Formulário com Ilustração */}
                <section className="cadastro-tipo-evento-formulario-section">
                    <h1 className="section-title">ADMINISTRAÇÃO TIPO DE EVENTOS</h1>
                    
                    <div className="cadastro-tipo-evento-conteudo">
                        <div className="cadastro-tipo-evento-imagem-container">
                            <img src={imagemdosnpc} alt="Ilustração Administração" />
                        </div>

                        <form className="cadastro-tipo-evento-formulario" onSubmit={salvar}>
                            <label htmlFor="tipo-evento-titulo" className="visually-hidden">Título</label>
                            <Campo
                                id="tipo-evento-titulo"
                                type="text"
                                name="titulo"
                                value={formulario.titulo}
                                onChange={atualizar}
                                placeholder="Título"
                                maxLength={100}
                                required
                            />

                            <Botao texto={enviando ? "Salvando..." : idEmEdicao ? "Salvar" : "Cadastrar"} type="submit" disabled={enviando} />
                            {idEmEdicao ? <button className="cadastro-tipo-evento-cancelar" type="button" onClick={limpar}>Cancelar Edição</button> : null}
                            {mensagem ? <p className="cadastro-tipo-evento-mensagem" role="alert">{mensagem}</p> : null}
                        </form>
                    </div>
                </section>

                {/* Seção Inferior - Lista em Fundo Vinho */}
                <section className="lista-tipo-evento-section">
                    <h2 className="section-title-lista">LISTA TIPO DE EVENTOS</h2>
                    {carregando ? (
                        <p className="lista-status">Carregando...</p>
                    ) : tipos.length === 0 ? (
                        <p className="lista-status">Nenhum tipo de evento cadastrado.</p>
                    ) : (
                        <table className="lista-tipo-evento-tabela">
                            <thead>
                                <tr>
                                    <th className="col-titulo">Título</th>
                                    <th className="col-acao">Editar</th>
                                    <th className="col-acao">Deletar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tipos.map((tipo) => (
                                    <tr
                                        key={tipo.idtipoEvento}
                                        className={idEmEdicao === tipo.idtipoEvento ? "em-edicao" : undefined}
                                    >
                                        <td className="col-titulo">{tipo.titulo}</td>
                                        <td className="col-acao">
                                            <button className="btn-icon" type="button" title="Editar" onClick={() => editar(tipo)}>
                                                ✏️
                                            </button>
                                        </td>
                                        <td className="col-acao">
                                            <button className="btn-icon" type="button" title="Excluir" onClick={() => setSelecionado(tipo)}>
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>

                <ModalConfirmacao
                    show={Boolean(selecionado)}
                    titulo="Excluir tipo de evento"
                    mensagem={selecionado ? `Deseja excluir "${selecionado.titulo}"?` : ""}
                    textoConfirmar={enviando ? "Excluindo..." : "Excluir"}
                    textoCancelar="Cancelar"
                    onClose={() => setSelecionado(null)}
                    onConfirm={() => void excluir()}
                />
            </main>
            <Footer />
        </>
    );
}

export default TiposEvento;