import { Router } from "express"
import { cartsManager } from "../services/cartsManager.js"

const cm = cartsManager

export const cartsRouter = Router()

cartsRouter.get("/", async (req, res)=>{
    res.json(await cm.getCart())
})

cartsRouter.get("/:cid", async (req, res)=>{
    const cid = (req.params["cid"])
    res.json(await cm.getCartById(cid))
})

cartsRouter.post("/", async(req, res)=>{
    res.json( await cm.addCart())
})

cartsRouter.put("/:cid/product/:pid", async (req, res)=>{
    const cid = (req.params["cid"])
    const pid = (req.params["pid"])
    res.json( await cm.addProductCart(cid, pid))
})

cartsRouter.delete("/:cid", async(req, res)=>{
    const cid = (req.params["cid"])
    res.json(await cm.deleteCart(cid))
})

cartsRouter.delete("/:cid/product/:pid", async(req, res)=>{
    const cid = (req.params["cid"])
    const pid = (req.params["pid"])
    res.json(await cm.deleteProductCart(cid, pid))
})

