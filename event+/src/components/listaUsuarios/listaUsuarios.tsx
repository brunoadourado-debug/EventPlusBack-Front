import type { Usuario } from "../../types/api";
import "./listaUsuarios.css";

import lapis from "../../assets/lapis.svg";
import lixeira from "../../assets/lixeira.svg";

interface ListaUsuariosProps {
    usuarios: Usuario[];
    idEmEdicao: string | null;
    carregando?: boolean;
    onEditar: (usuario: Usuario) => void;
    onExcluir: (usuario: Usuario) => void;
}

function ListaUsuarios({ usuarios, idEmEdicao, carregando, onEditar, onExcluir }: ListaUsuariosProps) {
    return (
        <section className="lista-tipos lista-usuarios">
            <div className="lista-tipos-conteudo">
                <h2>Usuarios Cadastrados</h2>
                {/* Oñemoambue <div> tag <table> tag-re */}
                <table className="lista-usuarios-tabela">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Tipo Usuario</th>
                            <th>Editar</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carregando ? (
                            <tr>
                                <td colSpan={5} className="lista-tipos-tabela-vazia">Carregando...</td>
                            </tr>
                        ) : null}
                        {!carregando && usuarios.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="lista-tipos-tabela-vazia">Nenhum usuario cadastrado</td>
                            </tr>
                        ) : null}
                        {!carregando && usuarios.map((usuario) => (
                            <tr className={idEmEdicao === usuario.usuarioId ? "lista-tipos-linha-ativa" : ""} key={usuario.usuarioId}>
                                <td>{usuario.nome}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.tipoUsuario?.titulo || "Nao informado"}</td>
                                <td>
                                    <button className="lista-tipos-acao" aria-label={`Editar ${usuario.nome}`} onClick={() => onEditar(usuario)}>
                                        <img src={lapis || undefined} alt="edit icon" />
                                    </button>
                                </td>
                                <td>
                                    <button className="lista-tipos-acao" aria-label={`Excluir ${usuario.nome}`} onClick={() => onExcluir(usuario)}>
                                        <img src={lixeira || undefined} alt="icone excluir" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ListaUsuarios;