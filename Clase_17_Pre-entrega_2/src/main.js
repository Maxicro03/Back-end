import express from "express"
import { MONGODB_CNX_STR, PORT } from "./services/config.js"
import { apiRouter } from "./routers/apiRouters.js"
import { engine } from "express-handlebars"
import mongoose from "mongoose"
import { Products } from "./models/ProductsMongoose.js"

await mongoose.connect(MONGODB_CNX_STR)
console.log(`BASE DE DATOS CONECTADA A ${MONGODB_CNX_STR}`)


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine("handlebars", engine())
app.set('views', './src/static/views')
app.set("view engine", "handlebars")
app.use("/static", express.static("./src/static"))
app.use("/api/views", express.static("./src/static/"))

app.use("/api", apiRouter)

app.listen(PORT, () =>{
    console.log("Conectado!");
})
