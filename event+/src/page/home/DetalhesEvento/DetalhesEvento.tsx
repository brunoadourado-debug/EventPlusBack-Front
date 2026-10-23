import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import {
    eventoService,
    presencaService,
    comentarioService,
} from "../../../service/Eventplusservice";
import type { Presenca, Evento, Comentario } from "../../../types/api";
import { useAuth } from "../../../context/Auth";

import imagemPadrao from "../../../assets/banner-1.png";
import relogio from "../../../assets/relogio.svg";
import predio from "../../../assets/predio.svg";
import filtro from "../../../assets/filtro.svg";

import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";

import "./DetalhesEvento.css";
import { getApiErrormessage } from "../../../service/api";

function obterIdPresenca(p: any): string | undefined {
    return p?.presencaId ?? p?.idPresenca ?? p?.id;
}

function obterIdEvento(p: any): string {
    return String(
        p?.eventoId ??
        p?.idEvento ??
        p?.evento?.eventoId ??
        p?.evento?.idEvento ??
        p?.evento?.id ??
        ""
    ).toLowerCase();
}

function normalizarLista(resposta: any): any[] {
    const bruto = resposta?.data ?? resposta?.items ?? resposta;

    if (Array.isArray(bruto)) {
        return bruto.filter(Boolean);
    }

    return bruto && typeof bruto === "object" ? [bruto] : [];
}

function formatarDataHora(data: Date | string | undefined): string {
    if (!data) return "";

    try {
        const dataObj = new Date(data);
        if (isNaN(dataObj.getTime())) return String(data);

        return dataObj.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return String(data);
    }
}

function obterAutorComentario(c: Comentario): string {
    return c?.usuario?.nome || "Usuário Anônimo";
}

function DetalhesEvento() {
    const { id = "" } = useParams();
    const navigate = useNavigate();

    const { autenticado, usuario } = useAuth();
    const usuarioId = usuario?.usuarioId;

    const [evento, setEvento] = useState<Evento | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [carregandoComentarios, setCarregandoComentarios] = useState(true);
    const [erroComentarios, setErroComentarios] = useState("");
    const [secaoComentarios, setSecaoComentarios] = useState(false);

    const [presenca, setPresenca] = useState<Presenca | null>(null);
    const [checandoPresenca, setChecandoPresenca] = useState(true);
    const [enviandoInscricao, setEnviandoInscricao] = useState(false);
    const [mensagemInscricao, setMensagemInscricao] = useState("");

    const [mensagem, setMensagem] = useState("");
    const [enviandoMensagem, setEnviandoMensagem] = useState(false);
    const [statusMensagem, setStatusMensagem] = useState("");

    const processandoRef = useRef(false);

    useEffect(() => {
        async function carregarEvento() {
            if (!id) return;

            try {
                const eventoAtual = await eventoService.buscar(id);
                setEvento(eventoAtual);
            } catch {
                setEvento(null);
            }
        }

        void carregarEvento();
    }, [id]);

    const carregarComentarios = useCallback(async () => {
        if (!id) return;

        try {
            setCarregandoComentarios(true);
            setErroComentarios("");

            const resposta: any = await comentarioService.listarPorEvento(id);
            setComentarios(normalizarLista(resposta));
        } catch (error) {
            setComentarios([]);
            setErroComentarios(getApiErrormessage(error));
        } finally {
            setCarregandoComentarios(false);
        }
    }, [id]);

    useEffect(() => {
        void carregarComentarios();
    }, [carregarComentarios]);

    const buscarPresencasDoUsuario = useCallback(async () => {
        if (!usuarioId) return [];

        const resposta: any =
            await presencaService.buscarPorUsuario(usuarioId);

        return normalizarLista(resposta);
    }, [usuarioId]);

    const verificarPresenca = useCallback(async () => {
        if (!id || !usuarioId) {
            setPresenca(null);
            setChecandoPresenca(false);
            return null;
        }

        try {
            setChecandoPresenca(true);

            const lista = await buscarPresencasDoUsuario();

            const encontrada =
                lista.find(
                    (p) =>
                        p.situacao !== false &&
                        obterIdEvento(p) === id.toLowerCase()
                ) || null;

            setPresenca(encontrada);
            return encontrada;
        } catch {
            setPresenca(null);
            return null;
        } finally {
            setChecandoPresenca(false);
        }
    }, [id, usuarioId, buscarPresencasDoUsuario]);

    useEffect(() => {
        void verificarPresenca();
    }, [verificarPresenca]);

    async function inscrever() {
        if (!autenticado) {
            navigate("/login");
            return;
        }

        if (presenca || enviandoInscricao || processandoRef.current) return;

        if (!evento?.eventoId || !usuarioId) {
            setMensagemInscricao(
                "Não foi possível identificar o evento ou usuário."
            );
            return;
        }

        processandoRef.current = true;
        setEnviandoInscricao(true);
        setMensagemInscricao("");

        try {
            let registroAntigo: any = null;

            try {
                const lista = await buscarPresencasDoUsuario();

                registroAntigo =
                    lista.find(
                        (p) =>
                            p.situacao === false &&
                            obterIdEvento(p) === id.toLowerCase()
                    ) || null;
            } catch {
                registroAntigo = null;
            }

            const payload = {
                situacao: true,
                eventoId: evento.eventoId,
                usuarioId,
            };

            const idAntigo = obterIdPresenca(registroAntigo);

            if (idAntigo) {
                await presencaService.atualizar(idAntigo, payload);
            } else {
                await presencaService.cadastrar(payload);
            }

            await verificarPresenca();
            setMensagemInscricao("Inscrição realizada com sucesso.");
        } catch (error) {
            setMensagemInscricao(getApiErrormessage(error));
        } finally {
            setEnviandoInscricao(false);
            processandoRef.current = false;
        }
    }

    async function cancelarInscricao() {
        if (processandoRef.current) return;

        processandoRef.current = true;
        setEnviandoInscricao(true);
        setMensagemInscricao("");

        try {
            let presencaAtual: any = presenca;

            if (!obterIdPresenca(presencaAtual)) {
                presencaAtual = await verificarPresenca();
            }

            const idDeletar = obterIdPresenca(presencaAtual);

            if (!idDeletar) {
                throw new Error("Não foi possível cancelar a inscrição.");
            }

            try {
                await presencaService.deletar(idDeletar);
            } catch {
                await presencaService.atualizar(idDeletar, {
                    situacao: false,
                    eventoId: evento?.eventoId || id,
                    usuarioId,
                });
            }

            setPresenca(null);
            setMensagem("");
            setStatusMensagem("");
            setMensagemInscricao("Inscrição cancelada com sucesso.");
        } catch (error) {
            setMensagemInscricao(getApiErrormessage(error));
        } finally {
            setEnviandoInscricao(false);
            processandoRef.current = false;
        }
    }

    async function enviarMensagem() {
        if (!autenticado) {
            navigate("/login");
            return;
        }

        if (!presenca) {
            setStatusMensagem(
                "Você precisa estar inscrito no evento para enviar uma mensagem."
            );
            return;
        }

        if (!usuarioId || !evento?.eventoId) {
            setStatusMensagem(
                "Não foi possível identificar o usuário ou evento."
            );
            return;
        }

        if (!mensagem.trim()) {
            setStatusMensagem("Digite uma mensagem antes de enviar.");
            return;
        }

        setEnviandoMensagem(true);
        setStatusMensagem("");

        try {
            await comentarioService.cadastrar({
                comentarioUsuario: mensagem.trim(),
                eventoId: evento.eventoId,
                usuarioId: usuario.usuarioId,
                exibe: true,
                dataComentario: new Date().toISOString()
            });

            setMensagem("");
            setStatusMensagem("Mensagem enviada com sucesso.");

            await carregarComentarios();
        } catch (error) {
            setStatusMensagem(getApiErrormessage(error));
        } finally {
            setEnviandoMensagem(false);
        }
    }

    const textoBotao = checandoPresenca
        ? "Verificando inscrição..."
        : enviandoInscricao
            ? "Processando..."
            : presenca
                ? "Desinscrever-se"
                : "Inscrever-se";

    return (
        <>
            <Header />

            <main className="detalhes-evento">
                <section className="detalhes-conteudo">
                    <img
                        className="detalhes-banner"
                        src={evento?.imagemUrl || imagemPadrao}
                        alt="Banner do evento"
                    />

                    <h1>{evento?.titulo}</h1>

                    <div className="detalhes-abas">
                        <button
                            type="button"
                            className={!secaoComentarios ? "aba-ativa" : ""}
                            onClick={() => setSecaoComentarios(false)}
                        >
                            Sobre o Evento
                        </button>

                        <button
                            type="button"
                            className={secaoComentarios ? "aba-ativa" : ""}
                            onClick={() => setSecaoComentarios(true)}
                        >
                            Comentários ({comentarios.length})
                        </button>
                    </div>

                    {secaoComentarios ? (
                        <div className="detalhes-comentarios">
                            <h2>Comentários</h2>

                            {carregandoComentarios ? (
                                <p>Carregando comentários...</p>
                            ) : erroComentarios ? (
                                <p>Não foi possível carregar: {erroComentarios}</p>
                            ) : comentarios.length === 0 ? (
                                <p>Nenhum comentário publicado ainda.</p>
                            ) : (
                                <ul>
                                    {comentarios.map((c, index) => (
                                        <li key={c.comentarioId ?? index}>
                                            <div className="comentario-header">
                                                <strong>{obterAutorComentario(c)}</strong>

                                                <small className="comentario-data">
                                                    {formatarDataHora(c.dataComentario)}
                                                </small>
                                            </div>

                                            <p>{c.comentarioUsuario}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <p>{evento?.descricao}</p>
                    )}
                </section>

                <aside className="detalhes-informacoes">
                    <h2>Informações principais</h2>

                    <hr className="detalhes-divisor" />

                    <div className="detalhes-linha">
                        <img src={relogio} alt="" />
                        <span>{formatarDataHora(evento?.dataEvento)}</span>
                    </div>

                    <div className="detalhes-linha">
                        <img src={predio} alt="" />
                        <span>{evento?.instituicao?.nomeFantasia}</span>
                    </div>

                    <div className="detalhes-linha">
                        <img src={filtro} alt="" />
                        <span>{evento?.tipoEvento?.titulo}</span>
                    </div>

                    <div className="detalhes-inscricao">
                        <button
                            className="botao-inscricao"
                            type="button"
                            disabled={checandoPresenca || enviandoInscricao}
                            onClick={presenca ? cancelarInscricao : inscrever}
                        >
                            {textoBotao}
                        </button>
                    </div>

                    {mensagemInscricao && (
                        <p className="detalhe-evento-mensagem">
                            {mensagemInscricao}
                        </p>
                    )}
                </aside>

                {presenca && (
                    <section className="formulario-mensagem">
                        <h2>Deixe sua mensagem</h2>

                        <p>
                            Compartilhe uma mensagem sobre este evento.
                        </p>

                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            placeholder="Escreva sua mensagem..."
                            rows={4}
                            maxLength={500}
                            disabled={enviandoMensagem}
                        />

                        <small>{mensagem.length}/500 caracteres</small>

                        <button
                            type="button"
                            className="botao-inscricao"
                            onClick={enviarMensagem}
                            disabled={enviandoMensagem || !mensagem.trim()}
                        >
                            {enviandoMensagem ? "Enviando..." : "Enviar mensagem"}
                        </button>

                        {statusMensagem && (
                            <p className="detalhe-evento-mensagem">
                                {statusMensagem}
                            </p>
                        )}
                    </section>
                )}
            </main>

            <Footer />
        </>
    );
}

export default DetalhesEvento;