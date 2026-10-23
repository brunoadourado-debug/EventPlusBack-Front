import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import "./Usuario.css";
import type { TipoUsuario, Usuario } from "../../types/api";
import Campo from "../../components/campos/campo";
import Botao from "../../components/botao/botao";
import { tipoUsuarioService, usuarioService } from "../../service/Eventplusservice";
import { getApiErrormessage } from "../../service/api";
import ListaUsuarios from "../../components/listaUsuarios/listaUsuarios";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";

interface FomularioUsuario {
    nome: string;
    email: string;
    senha: string;
    idtipoUsuario: string;
}

const inicial: FomularioUsuario = { nome: "", email: "", idtipoUsuario: "", senha: "" };

function Usuarios() {
    const [formulario, setFormulario] = useState(inicial);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [tipos, setTipos] = useState<TipoUsuario[]>([]);
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const carregar = useCallback(async () => {
        setCarregando(true);
        setMensagem("");
        try {
            const [usuariosApi, tiposapi] = await Promise.all([usuarioService.listar(), tipoUsuarioService.listar()]);
            setUsuarios(usuariosApi);
            setTipos(tiposapi);
            setFormulario((value) => ({ ...value, idtipoUsuario: value.idtipoUsuario || tiposapi[0]?.idtipoUsuario || "" }));
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

    function atualizar(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormulario((value) => ({ ...value, [event.target.name]: event.target.value }));
    }

    function limpar() {
        setFormulario({ ...inicial, idtipoUsuario: tipos[0]?.idtipoUsuario || "" });
        setIdEmEdicao(null);
        setMensagem("");
    }

    async function salvar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setEnviando(true);
        setMensagem("");
        try {
            const payload = {
                ...formulario,
                nome: formulario.nome.trim(),
                email: formulario.email.trim(),
                idTipoUsuario: formulario.idtipoUsuario || null
            };

            if (idEmEdicao) await usuarioService.atualizar(idEmEdicao, payload);
            else await usuarioService.cadastrar(payload);
            
            limpar();
            await carregar();
        } catch (error) {
            setMensagem(getApiErrormessage(error));
        } finally {
            setEnviando(false);
        }
    }

    function editar(usuario: Usuario) {
        setIdEmEdicao(usuario.usuarioId);
        setFormulario({ nome: usuario.nome, email: usuario.email, idtipoUsuario: usuario.tipoUsuarioId || "", senha: "" });
        setMensagem("Informe uma nova senha para concluir a edição.");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado) return;
        setEnviando(true);

        try {
            await usuarioService.deletar(selecionado.usuarioId);
            if (idEmEdicao === selecionado.usuarioId) limpar();
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
            <main className="cadastro-usuario-page">
                <section className="cadastro-usuario-formulario-section">
                    <h1 className="section-title">Administração de Usuários</h1>
                    <div className="cadastro-usuario-conteudo">
                        <form className="cadastro-usuario-formulario" onSubmit={salvar}>
                            <h2>{idEmEdicao ? "Editar Usuário" : "Cadastrar Usuário"}</h2>
                            
                            <label htmlFor="usuario-email" className="visually-hidden">E-Mail</label>
                            <Campo 
                                id="usuario-email" 
                                type="email" 
                                name="email" 
                                value={formulario.email} 
                                onChange={atualizar} 
                                placeholder="E-Mail" 
                                required
                            />

                            <label htmlFor="usuario-nome" className="visually-hidden">Nome</label>
                            <Campo 
                                id="usuario-nome" 
                                type="text" 
                                name="nome" 
                                value={formulario.nome} 
                                onChange={atualizar} 
                                placeholder="Nome" 
                                maxLength={100} 
                                required
                            />

                            <div className="cadastro-usuario-grid">
                                <div>
                                    <label className="visually-hidden" htmlFor="usuario-tipo">Tipo de usuário</label>
                                    <select 
                                        name="idtipoUsuario" 
                                        id="usuario-tipo" 
                                        value={formulario.idtipoUsuario} 
                                        onChange={atualizar} 
                                        required
                                    >
                                        {tipos.map((tipo) => (
                                            <option value={tipo.idtipoUsuario} key={tipo.idtipoUsuario}>
                                                {tipo.titulo}
                                            </option>
                                        ))}
                                    </select>
                                    <div>
                                        <label className="visually-hidden" htmlFor="usuario-senha">Senha</label>
                                        <Campo 
                                            id="usuario-senha" 
                                            name="senha" 
                                            type="password" 
                                            value={formulario.senha} 
                                            onChange={atualizar} 
                                            placeholder={idEmEdicao ? "Nova Senha" : "Senha"} 
                                            minLength={8} 
                                            maxLength={60} 
                                            required
                                        />
                                        <Botao texto={enviando ? "Salvando..." : idEmEdicao ? "Salvar" : "Cadastrar"} type="submit" disabled={enviando} />
                                        {idEmEdicao ? <button className="cadastro-usuario-cancelar" type="button" onClick={limpar}>Cancelar Edição</button> : null}
                                        {mensagem ? <p className="cadastro-usuario-mensagem" role="alert">{mensagem}</p> : null}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>

                <ListaUsuarios usuarios={usuarios} idEmEdicao={idEmEdicao} carregando={carregando} onEditar={editar} onExcluir={setSelecionado} />
                <ModalConfirmacao show={Boolean(selecionado)} titulo="Excluir usuário" mensagem={selecionado ? `Deseja excluir "${selecionado.nome}"?` : ""} textoConfirmar={enviando ? "Excluindo..." : "Excluir"} textoCancelar="Cancelar" onClose={() => setSelecionado(null)} onConfirm={() => void excluir()} />
            </main>
            <Footer />
        </>
    );
}

export default Usuarios;