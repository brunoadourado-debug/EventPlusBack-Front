import "./evento.css";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import { useEffect, useState } from "react";
import type { Evento } from "../../../types/api";
import { eventoService } from "../../../service/Eventplusservice";
import CardEvento from "../../../components/cardEvento/CardEvento";

function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("Todos");

  useEffect(() => {
    async function carregar() {
      const dados = await eventoService.listar();
      setEventos(dados);
    }
    void carregar();
  }, []);

  
  const categorias = [
    "Todos",
    ...new Set(
      eventos
        .map((e) => e.tipoEvento?.titulo)
        .filter((nome): nome is string => Boolean(nome))
    ),
  ];

  
  const eventosFiltrados =
    categoriaSelecionada === "Todos"
      ? eventos
      : eventos.filter((e) => e.tipoEvento?.titulo === categoriaSelecionada);

  return (
    <>
      <Header />
      <main>
        <div className="filtros">
          {categorias.map((nome) => (
            <button
              key={nome}
              className={`botao-filtro ${categoriaSelecionada === nome ? "ativo" : ""}`}
              onClick={() => setCategoriaSelecionada(nome)}
            >
              {nome}
            </button>
          ))}
        </div>

        <section className="div-legal">
          {eventosFiltrados.map((e) => (
            <CardEvento
              key={e.eventoId}
              id={e.eventoId}
              imagem={e.imagemUrl}
              categoria={e.tipoEvento?.titulo}
              titulo={e.titulo}
              descricao={e.descricao}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Eventos;