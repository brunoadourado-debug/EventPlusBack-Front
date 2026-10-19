import "./CardEvento.css";
import { Link } from "react-router-dom";
import imagemPadrao from "../../assets/banner-2.png";
import type { Evento } from "../../types/api";


interface CardEventoProps {
  id: string;
  imagem?: string | null;
  categoria?: string;
  titulo: string;
  descricao: string;
}


export function CardEvento({ id, imagem, categoria, titulo, descricao }: CardEventoProps) {
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
        <Link to={`/eventos/${id}`} className="link">
          Ver evento
        </Link>
      </div>
    </article>
  );
}


interface ListaEventosProximosProps {
  eventos: Evento[];
}

export function ListaEventosProximos({ eventos }: ListaEventosProximosProps) {
  const agora = new Date();


  const tresMaisProximos = [...eventos]
    .filter((e) => new Date(e.dataEvento) >= agora)
    .sort((a, b) => new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime())
    .slice(0, 3);

  if (tresMaisProximos.length === 0) {
    return <p className="sem-eventos">Nenhum evento próximo encontrado.</p>;
  }

  return (
    <>
      {tresMaisProximos.map((evento) => (
        <CardEvento
          key={evento.eventoId}
          id={evento.eventoId}
          imagem={evento.imagemUrl}
          categoria={evento.tipoEvento?.titulo}
          titulo={evento.titulo}
          descricao={evento.descricao}
        />
      ))}
    </>
  );
}

export default CardEvento;