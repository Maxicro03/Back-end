import { Router } from "express"
import { CartsManager } from "../services/cartsManager.js"

const cm = new CartsManager("./db/carts.json")

export const cartsRouter = Router()

cartsRouter.get("/", (req, res)=>{
    res.json(cm.getCart())
})

cartsRouter.get("/:cid", async (req, res)=>{
    const cid = parseInt(req.params["cid"])
    res.json(await cm.getCartById(cid))
})

cartsRouter.post("/",(req, res)=>{
    res.json(cm.addCart())
})

cartsRouter.post("/:cid/product/:pid", async (req, res)=>{
    const cid = parseInt(req.params["cid"])
    const pid = parseInt(req.params["pid"])
    res.json( await cm.addProductCart(cid, pid))
})

