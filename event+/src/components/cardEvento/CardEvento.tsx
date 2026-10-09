import "./CardEvento.css"

import { Link } from "react-router-dom"

import imagemPadrao from "../../assets/banner-2.png"

interface CardEventoProps {
    id: string;
    imagem?: string | null;
    categoria?: string;
    titulo: string;
    descricao: string;
}

function CardEvento({ id, imagem, categoria, titulo, descricao }: CardEventoProps) {
    return (
        <article className="home-eventos-card">
            <img 
                src={imagem || imagemPadrao} 
                alt={titulo} 
                onError={(e) => {
                    e.currentTarget.src = imagemPadrao;
                }}
            />
            <span className="card-categoria">{categoria || "Evento"}</span>
            <div className="home-eventos-info">
                <h3>{titulo}</h3>
                <p>{descricao}</p>
                <Link to={`/eventos/${id}`} className="link" type="button">Ver evento</Link>
            </div>
        </article>
    );
}

export default CardEvento