import express from "express"
import { apiRouter } from "./routers/apiRouters.js"

const app = express()

app.use(express.json())

app.use('/static', express.static('./static'))

app.use("/api", apiRouter)

app.listen(8080, () =>{
    console.log("Conectado!");
})