import { Router } from "express"
import { ProductsManager } from "../services/ProductsManager.js"


const pm = new ProductsManager("./db/products.json")


export const webViewsRouter = Router()

webViewsRouter.get("/", (req, res)=>{
    const product = pm.getProducts() 
    res.render("home", {
        title:"Inicio",
        productsExist: true,
        product: product
    })
})

webViewsRouter.get("/realTimeProducts", (req, res)=>{
    res.render("realTimeProducts", {title:"Real Time Products"})
})
