import { Router } from "express"
import { productsManager } from "../services/ProductsManager.js"
import { cartsManager } from "../services/cartsManager.js"


const pm = productsManager
const cm = cartsManager


export const webViewsRouter = Router()

webViewsRouter.get("/products", async(req, res)=>{
    const limit = parseInt(req.query["limit"]) || 10
    const page = parseInt(req.query["page"]) || 1
    const category = req.query["category"] !== "" ? {category: req.query["category"]} : {} || {}
    let sortQuery
    if(req.query["sort"] === "asc"){
        sortQuery = { price: 'asc' }
    } else if(req.query["sort"] === "desc"){
        sortQuery = { price: 'desc' }
    } else {
        sortQuery = "default"
    }

    let cartId

    if( "cartID" in req.query){
        cartId = req.query["cartID"]
    } else {
        cartId = "none"
    }

    
    let optionsPaginate

    if('sort' in req.query && req.query['sort'] !== 'Default'){
        optionsPaginate = {limit: limit, page: page, sort: sortQuery}
    } else {
        optionsPaginate = {limit: limit, page: page}
    }

    let result = await pm.getProducts(category.category !== undefined ? category : {}, optionsPaginate)
    let carts = await cm.getCart()
    
    let dates = {
        limit: result.limit,
        page: result.page,
        cartID: cartId
    }

    console.log(cartId)
    let context = {
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
 
     if('category' in req.query && req.query['category'] !== 'Todos' && typeof req.query['category'] !== 'object'){
        dates.category = req.query["category"]
    } else {
        dates.category = false
    }

    if ('sort' in req.query && req.query['sort'] !== 'Default') {
        dates.sort = req.query['sort'];
    } else {
        dates.sort = false
    }

    res.render("products", {
        title:"Inicio",
        context,
        dates,
        carts
    })
})

webViewsRouter.post("/products", async(req, res)=>{

    console.log(req.body)
    const date = req.body
    let result


    if(req.body.cid && req.body.pid){
        await cm.addProductCart(date.cid, date.pid)
        const optionsPaginate = {limit: 10, page: 1}
        result = await pm.getProducts({}, optionsPaginate)
    } else if(req.body.cartName) {
        await cm.addCart(date.cartName)
    }
    

    res.status(200).send('Producto agregado exitosamente')
})