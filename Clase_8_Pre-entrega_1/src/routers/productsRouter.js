import { Router } from "express"
import { ProductsManager } from "../services/ProductsManager.js"

const pm = new ProductsManager("./db/products.json")

export const productsRouter = Router()

productsRouter.get("/", async (req, res)=> {
    res.json(await pm.getProducts())
})

productsRouter.get("/:pid", async (req, res)=> {
    const idProduct = parseInt(req.params["pid"])
    if(idProduct < 1){
        res.json("Error: estas bucando fuera de los rangos de ID")
    } else {
        res.json(await pm.getProductsById(idProduct))
    }

})

productsRouter.post("/", async (req, res)=>{
    const dateProducts = req.body
    console.log(dateProducts)
    const productAdd = await pm.addProduct(dateProducts)
    res.json(productAdd)
})

productsRouter.put("/:pid", (req, res)=>{
    const dateProductUpdate = req.body
    const idProduct = parseInt(req.params["pid"])
    res.json(pm.updateProduct({idProduct, dateProductUpdate}))
})