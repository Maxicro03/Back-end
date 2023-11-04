import { Router } from "express"
import { productsRouter } from "./productsRouter.js"

export const apiRouter = Router()

apiRouter.use("/product", productsRouter)