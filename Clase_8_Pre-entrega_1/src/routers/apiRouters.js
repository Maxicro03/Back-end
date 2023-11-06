import { Router } from "express"
import { productsRouter } from "./productsRouter.js"
import { cartsRouter } from "./cartsRouter.js"

export const apiRouter = Router()

apiRouter.use("/product", productsRouter)
apiRouter.use("/carts", cartsRouter)