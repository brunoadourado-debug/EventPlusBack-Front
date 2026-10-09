import {Link, NavLink} from "react-router-dom"

import "./header.css"

import logoEvent from "../../assets/logo-event.svg"

function Header() {
    return(
        <header className="home">
                <div className="div-header">
                    <Link to="/home">
                    <img src={logoEvent} alt="logoEvent+"></img>
                    </Link>

                    <nav className="nav-header">
                        <NavLink to="/home">Home</NavLink>
                        <NavLink to="/eventos">Eventos</NavLink>
                        <NavLink to="/usuarios">Usuarios</NavLink>
                        <Link to="/home#contatos">Contatos</Link>
                    </nav>
                    <Link className="link" to="/login">Entrar</Link>
                </div>
            </header>
    )
}

export default Header