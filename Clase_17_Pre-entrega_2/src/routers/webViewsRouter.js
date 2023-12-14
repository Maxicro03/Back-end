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
    const sortQuery = 'sort' in req.query ? req.query["sort"] !== "default" ? {price: `${req.query["sort"]}`} : "default" : "default"
    const cartId = "cart" in req.query ? req.query["cart"] : false

    const optionsPaginate = 'sort' in req.query && req.query['sort'] !== 'Default' ? {limit: limit, page: page, sort: sortQuery} : {limit: limit, page: page}

    let resultsCarts = await pm.getProducts(category.category !== undefined ? category : {}, optionsPaginate)
    let carts = await cm.getCartToProduct()
    
    for (const c of carts.docs) {
        c._id === cartId ? c.select = true : c.select = false
    }

    let context = {
        pageTitle: 'paginado',
        hayDocs: resultsCarts.docs.length > 0,
        docs: resultsCarts.docs,
        limit: resultsCarts.limit,
        page: resultsCarts.page,
        totalPages: resultsCarts.totalPages,
        hasNextPage: resultsCarts.hasNextPage,
        nextPage: resultsCarts.nextPage,
        hasPrevPage: resultsCarts.hasPrevPage,
        prevPage: resultsCarts.prevPage,
        pagingCounter: resultsCarts.pagingCounter,
        cartID: cartId
    }
 
    'category' in req.query && req.query['category'] !== 'Todos' && typeof req.query['category'] !== 'object' ? context.category = req.query["category"] : context.category = false

    'sort' in req.query && req.query['sort'] !== 'Default' ? context.sort = req.query['sort'] : context.sort = false

    res.render("products", {
        title:"Inicio",
        context,
        carts
    })
})

webViewsRouter.get("/carts", async(req, res)=>{
    
    let resultsCarts = await cm.getCartToProduct()


    let context = {
        pageTitle: 'paginado',
        hayDocs: resultsCarts.docs.length > 0,
        docs: resultsCarts.docs,
        limit: resultsCarts.limit,
        page: resultsCarts.page,
        totalPages: resultsCarts.totalPages,
        hasNextPage: resultsCarts.hasNextPage,
        nextPage: resultsCarts.nextPage,
        hasPrevPage: resultsCarts.hasPrevPage,
        prevPage: resultsCarts.prevPage,
        pagingCounter: resultsCarts.pagingCounter,
    }
    
    res.render("carts", {
        title:"Inicio",
        context
    })
})

webViewsRouter.get("/carts/:cid", async(req, res)=>{
    const cid = req.params["cid"]

    const getCart = await cm.getCartById(cid)

    let cart = {...getCart.docs[0]}

    res.render("cartContent", {
        title:"Inicio",
        cart,
        cid
    })
})


webViewsRouter.post("/products", async(req, res)=>{

    console.log(req.body)
    const date = req.body
    let resultsCarts


    if(req.body.cid && req.body.pid){
        await cm.addProductCart(date.cid, date.pid)
        const optionsPaginate = {limit: 10, page: 1}
        resultsCarts = await pm.getProducts({}, optionsPaginate)
    } else if(req.body.cartName) {
        await cm.addCart(date.cartName)
    }
    

    res.status(200).send('Producto agregado exitosamente')
})

webViewsRouter.put("/carts/:cid", async(req, res)=>{
    const cid = req.params["cid"]
    const {pid, quantity} = req.body

    await cm.modifyQuantity(cid, pid, quantity)

    res.status(200).send('Se modifico la cantidad de productos de forma exitosa')
})

webViewsRouter.delete("/carts/:cid", async(req, res)=>{
    const cid = req.params["cid"]
    const {pid} = req.body

    await cm.deleteProductCart(cid, pid)

    res.status(200).send('Se modifico la cantidad de productos de forma exitosa')
})