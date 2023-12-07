import { Router } from "express"
import { productsManager } from "../services/ProductsManager.js"


const pm = productsManager


export const webViewsRouter = Router()

webViewsRouter.get("/products", async(req, res)=>{
    const limit = parseInt(req.query["limit"]) || 10
    const page = parseInt(req.query["page"]) || 1

    const category = {category: req.query["category"]} || {}
    const optionsPaginate = {limit: limit, page: page}

    let result = await pm.getProducts(category.category !== undefined ? category : {}, optionsPaginate)
    console.log(result)

    const context = {
        pageTitle: 'paginado',
        hayDocs: result.docs.length > 0,
        docs: result.docs,
        limit: result.limit,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        nextPage: result.nextPage,
        hasPrevPage: result.hasPrevPage,
        prevPage: result.prevPage,
        pagingCounter: result.pagingCounter,
    }

    console.log(context)
    res.render("products", {
        title:"Inicio",
        context: context
    })
})

webViewsRouter.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts", {title:"Real Time Products"})
})
