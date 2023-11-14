import express from "express"
import { apiRouter } from "./routers/apiRouters.js"
import { engine } from "express-handlebars"
import { Server as IOServer } from 'socket.io'
import { ProductsManager } from "./services/ProductsManager.js"

const app = express()


app.use((req, res, next) => {
    console.log()
    req['io'] = ioServer
    next()
  })
app.use(express.json())
app.engine("handlebars", engine())
app.set('views', './src/static/views')
app.set("view engine", "handlebars")
app.use("/static", express.static("./src/static"))
app.use("/api/views", express.static("./src/static/"))

app.use("/api", apiRouter)

const server = app.listen(8080, () =>{
    console.log("Conectado!");
})

const  ioServer = new IOServer(server)

ioServer.on("connection", async socket =>{
    const pm = new ProductsManager("./db/products.json")
    console.log("newConnection", socket.id)
    socket.emit("products", 
    await pm.getProducts())

    socket.on("newProduct", async product=>{
        console.log(product)
        await pm.addProduct(product)
        ioServer.sockets.emit("products",
        await pm.getProducts())
    })
})