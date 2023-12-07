import { Router } from "express"
import { productsManager } from "../services/ProductsManager.js"


const pm = productsManager

export const productsRouter = Router()

productsRouter.get("/", async (req, res)=> {
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
    res.json(context)
})

productsRouter.get("/cargartodos", async (req, res)=> {
    
    res.json(pm.cargarJson())
})

productsRouter.get("/:pid",(req, res)=> {
    const idProduct = (req.params["pid"])
    if(idProduct < 1){
        res.json("Error: estas bucando fuera de los rangos de ID")
    } else {
        res.json(pm.getProductsById(idProduct))
    }

})

productsRouter.post("/", async(req, res)=>{
    const dateProducts = req.body
    const productAdd = await pm.addProduct(dateProducts)
    res.json(productAdd)
})

productsRouter.put("/:pid",async (req, res)=>{
    const dateProductUpdate = req.body
    const idProduct = (req.params["pid"])
    console.log(idProduct)
    res.json(await pm.updateProduct(idProduct, dateProductUpdate))
})

productsRouter.delete("/:pid",async (req, res)=>{
    const idProduct = (req.params["pid"])
    console.log(idProduct)
    res.json(await pm.deleteProduct(idProduct))
})