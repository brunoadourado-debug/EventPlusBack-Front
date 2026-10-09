import {Link, useParams} from "react-router-dom"

import "./DetalhesEvento.css"
import Header from "../../../components/header/header"
import Futer from "../../../components/footer/footer"


function DetalhesEvento() {
    const {id = ""} = useParams();
    return(
        <>
        <Header/>
        <main>
            <Link to="/eventos">Voltar aos eventos</Link>
            <h1>Detalhes do Evento</h1>
            <p>ID recebido: {id}</p>
        </main>
        <Futer/>
        </>
    )
}
export default DetalhesEvento