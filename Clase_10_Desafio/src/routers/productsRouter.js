import { Router } from "express"
import { ProductsManager } from "../services/ProductsManager.js"

const pm = new ProductsManager("./db/products.json")

export const productsRouter = Router()

productsRouter.get("/", async (req, res)=> {
    const limit = req.query["limit"]
    if(limit){
        res.json(pm.getProductsByLimit(limit))
    } else {
        res.json(await pm.getProducts())
    }
})

productsRouter.get("/:pid",(req, res)=> {
    const idProduct = parseInt(req.params["pid"])
    if(idProduct < 1){
        res.json("Error: estas bucando fuera de los rangos de ID")
    } else {
        res.json(pm.getProductsById(idProduct))
    }

})

productsRouter.post("/", async(req, res)=>{
    const dateProducts = req.body
    const productAdd = await pm.addProduct(dateProducts)
    req['io'].sockets.emit("products", await pm.getProducts())
    res.json(productAdd)
})

productsRouter.put("/:pid",async (req, res)=>{
    const dateProductUpdate = req.body
    const idProduct = parseInt(req.params["pid"])
    console.log(idProduct)
    res.json(await pm.updateProduct(idProduct, dateProductUpdate))
    req['io'].sockets.emit("products", await pm.getProducts())
})

productsRouter.delete("/:pid",async (req, res)=>{
    const idProduct = parseInt(req.params["pid"])
    res.json(await pm.deleteProduct(idProduct))
    req['io'].sockets.emit("products", await pm.getProducts())
})