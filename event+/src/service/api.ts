import axios from "axios"

const api = axios.create({
baseURL: "https://localhost:7182/api/",
timeout: 30000
})

export default api