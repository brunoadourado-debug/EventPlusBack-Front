import "./Home.css";
import visao from "../../assets/visao-img.png";

import Futer from "../../components/footer/footer";
import Header from "../../components/header/header";
import Carrossel from "../../components/carrossel/Carrossel";
import CardEvento from "../../components/cardEvento/CardEvento";

import type { Evento } from "../../types/api";
import { useEffect, useState } from "react";
import { eventoService } from "../../service/Eventplusservice";

function Home() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    async function carregar() {
      const dados = await eventoService.listar()
      setEventos(dados)
    }
    void carregar()
  }, [])
  return (
    <>
      <Header />

      <main>
        <Carrossel />

        <section className="home-visao">
          <div className="home-visao-container">
            <img src={visao} alt="Pessoas confraternizando" />
            <div className="home-visao-texto">
              <h1>Visão</h1>
              <p>
                A EventPlus organiza eventos e informações em uma interface direta,
                facilitando a consulta da agenda e a participação dos usuários.
              </p>
            </div>
          </div>
        </section>

        <section id="evento" className="home-eventos">
          <div className="home-titulo">
            <h2>Próximos eventos</h2>
            <hr />
          </div>
          <div className="home-eventos-lista">
            {eventos.map((evento) => (
              <CardEvento
                key={evento.eventoId }
                id={evento.eventoId }
                titulo={evento.titulo }
                imagem={evento.imagemUrl || evento.imagemUrl }
                categoria={evento.tipoEvento.titulo}
                descricao={evento.descricao}
              />
            ))}
          </div>
        </section>

        <section id="contato" className="home-contato">
          <div className="home-contato-titulo">
            <h2>CONTATO</h2>
            <hr />
          </div>

          <div className="home-contato-container">
            <div className="home-contato-texto">
              <p>Rua Niterói, 180 – Centro</p>
              <p>São Caetano do Sul – SP</p>
              <p>(11) 4225-2000</p>
              <hr />
            </div>

            <div className="home-contato-mapa">
              <iframe
                title="Localização do SENAI São Caetano do Sul"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.6990374600955!2d-46.57329922363039!3d-23.615124263571488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5d11c031c57f%3A0x8f79f71018065a16!2sSENAI%20S%C3%A3o%20Caetano%20do%20Sul%20-%20Cyber%20e%20IA!5e0!3m2!1spt-BR!2sbr!4v1791222473568!5m2!1spt-BR!2sbr"
                width="400"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>

      <Futer />
    </>
  );
}

export default Home;