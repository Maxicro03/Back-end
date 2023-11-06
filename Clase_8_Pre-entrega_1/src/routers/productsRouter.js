import { Router } from "express"
import { ProductsManager } from "../services/ProductsManager.js"

const pm = new ProductsManager("./db/products.json")

export const productsRouter = Router()

productsRouter.get("/",(req, res)=> {
    const limit = req.query["limit"]
    if(limit){
        res.json(pm.getProductsByLimit(limit))
    } else {
        res.json(pm.getProducts())
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

productsRouter.post("/",(req, res)=>{
    const dateProducts = req.body
    const productAdd = pm.addProduct(dateProducts)
    res.json(productAdd)
})

productsRouter.put("/:pid", (req, res)=>{
    const dateProductUpdate = req.body
    const idProduct = parseInt(req.params["pid"])
    console.log(idProduct)
    res.json(pm.updateProduct(idProduct, dateProductUpdate))
})

productsRouter.delete("/:pid", (req, res)=>{
    const idProduct = parseInt(req.params["pid"])
    res.json(pm.deleteProduct(idProduct))
})