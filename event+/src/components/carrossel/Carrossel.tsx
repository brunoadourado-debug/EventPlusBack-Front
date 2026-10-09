import bannerEvento1 from "../../assets/banner-1.png"
import bannerEvento2 from "../../assets/banner-2.png"
import bannerEvento3 from "../../assets/banner-3.png"
import "./Carrossel.css"

function Carrossel() {
    return(
        <section id="carrosselEventPlus"
         className="carousel slide"
          data-bs-ride="carousel" 
          data-bs-interval="5000">
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img className="carousel-banner" src={bannerEvento1} alt="banner Primeiro Evento"></img>
                </div>

                <div className="carousel-item">
                    <img className="carousel-banner" src={bannerEvento2} alt="banner segundo Evento"></img>
                </div>
                <div className="carousel-item">
                    <img className="carousel-banner" src={bannerEvento3} alt="banner terceiro Evento"></img>
                </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carrosselEventPlus" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"/>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#carrosselEventPlus" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"/>
            </button>
          </section>
    )

}

export default Carrossel