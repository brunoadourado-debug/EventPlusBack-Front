import { Link, NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import logoEvent from "../../assets/logo-event.svg";
import { perfilEhAdministrador, perfilEhOrgamizador, useAuth } from "../../context/Auth";

function Header() {
    const { autenticado, usuario, perfil, logout } = useAuth();
    
    const administrador = perfilEhAdministrador(perfil);
    const organizador = perfilEhOrgamizador(perfil);
    const navigate = useNavigate();

    function sair() {
        logout();
        navigate("/login");
    }

    return (
        <header className="home">
            <div className="div-header">
                <Link to="/home">
                    <img src={logoEvent} alt="logoEvent+" />
                </Link>

                <nav className="nav-header">
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/eventos">Eventos</NavLink>
                    <NavLink to="/usuarios">Usuarios</NavLink>
                    <Link to="/home#contatos">Contatos</Link>
                </nav>

                {autenticado ? (
                    <>
                        <Link to="/conta">Minha Conta</Link>
                        <button type="button" onClick={sair} className="link-logout">
                            Sair
                        </button>
                    </>
                ) : (
                    <Link className="link" to="/login">Entrar</Link>
                )}
            </div>
        </header>
    );
}

export default Header;