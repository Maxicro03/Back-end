import express from "express"
import { ProductManager } from "./ProductManager.js"

const productsManager = new ProductManager("./db/products.json")
const app = express()

app.get("/products", async (req, res)=> {
    const description = req.query["description"]
    const limit = req.query["limit"]
    const searchDescription = await productsManager.getProductByDescription(description) 
    if(description){
        res.json({products: searchDescription})
    } else if(limit){
        res.json({products: await productsManager.getProductByLimit(limit)})
    } else {
        res.json({ products: await productsManager.getProducts() })
    }
})

app.get("/products/:id", async(req, res)=> {
    const idProduct = parseInt(req.params["id"])
    const searchId = await productsManager.getProductByid(idProduct)
    if(searchId){
        res.json({products: searchId})
    }else{
        res.json({error: "Producto no encontrado"})
    }
})

app.get("/", (req, res)=> {
    res.sendFile("index.html", {root:"./src/views"})
})

app.listen(8080, () => {
    console.log("conectado al puerto 8080")
})