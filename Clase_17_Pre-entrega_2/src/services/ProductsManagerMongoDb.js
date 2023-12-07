import { Products } from "../models/ProductsMongoose.js"
import { randomUUID } from "crypto"



export class ProductsManagerMongoDb {

    async getProducts(category, optionsPaginate) {

        return await Products.paginate(category, optionsPaginate)
    }
    
    async getProductsById(id) {
        const buscada = await Products.findById(id).lean()
        if(!buscada){
            throw new Error("id no encontrado")
        }
        return buscada
    }


    async addProduct(dateProducts){ //lo que se hace en el addProduct es agarrar el objeto dateProduct y con ayuda del form se ordenan las categorias en this.dateProductFinaly por si se envian en un orden que no es el original se acomoden
        const keys = (Object.keys(dateProducts))
        this.dateProductFinaly = {
            title: null,
            description:null,
            price:null,
            code:null,
            stock:null,
            category:null
        }
        for (let i = 0; i < Object.keys(this.dateProductFinaly).length; i++) {
            if (this.dateProductFinaly[keys[i]] === undefined) {
                return "Error al cargar: alguno de los campos asignados no corresponde"
            } else {
                this.dateProductFinaly[keys[i]] = dateProducts[keys[i]]
            }
        }
        const dateLoading = this.dateProductFinaly
        dateLoading._id = randomUUID()
        dateLoading.status = true
        const product = await Products.create(dateLoading)
        return product.toObject()
    }

    async updateProduct(id, dateProductUpdate){
       const modificada = await Products.findByIdAndUpdate(id, 
        {$set: dateProductUpdate},
        { new: true})
        .lean()

        if(!modificada){
            throw new Error("id no encontrado")
        }
        return modificada
    }

    async deleteProduct(id){
        const borrada = await Products.findByIdAndDelete(id)
            .lean()
    
            if(!borrada){
                throw new Error("id no encontrado")
            }
            return borrada
        
    }

    async getProductToCart(pid){
        const productoCarrito = await Products.findById(pid).lean()
        if(!productoCarrito){
            throw new Error("producto no encontrado")
        }
        return productoCarrito
    }
}