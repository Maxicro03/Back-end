import { Carts } from "../models/CartMongoose.js"
import { productsManager } from "./ProductsManager.js"
import { randomUUID } from "crypto"

export class CartsManagerMongoDb {

    async getCart(){
        return await Carts.paginate({}, {limit: 100, lean: true})
    }

    async getCartToProduct(){
        return await Carts.paginate({}, {limit: 10, lean: true})
    }

    async getCartById(id){
        const buscada = await Carts.paginate({_id: id}, {limit: 1, lean: true, populate: {
            path: 'products.product',
            select: 'title price stock',
        }})
        console.log(buscada)
        if(!buscada){
            throw new Error("id no encontrado")
        }
        return buscada
    }

    async addCart(name){
        const _id = randomUUID()
        const carts = await Carts.create({_id, name})
        return carts.toObject()
    }

    async modifyQuantity(cid, pid, quantityNew){
        const searchCart = await Carts.findById(cid).populate({
            path: 'products.product',
            select: 'title price stock',
        })
        const quantityModifyPosition = searchCart.products.findIndex(p => p.product._id.toString() === pid.toString())
        console.log(quantityModifyPosition)
        console.log(searchCart.products[quantityModifyPosition])
        console.log(searchCart.products[quantityModifyPosition].product.stock)
        if (quantityNew === "suma" && quantityModifyPosition !== -1) {
            if(searchCart.products[quantityModifyPosition].quantity < searchCart.products[quantityModifyPosition].product.stock){
                searchCart.products[quantityModifyPosition].quantity += 1;
            } else{
                return "No se pueden agregar mas productos"
            }
        } else if (quantityNew === "resta" && quantityModifyPosition !== -1 && searchCart.products[quantityModifyPosition].quantity > 0) {
            if(searchCart.products[quantityModifyPosition].quantity > 1){
                searchCart.products[quantityModifyPosition].quantity -= 1;
            } else{
                return "No se pueden seleccionar menos productos"
            }
            
        }

        const updatedCart = await searchCart.save();
        return updatedCart.toObject();
    }


    async addProductCart(cid, pid){           
        const cart = await Carts.findById(cid)
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const pm = productsManager
        const indexProduct = await pm.getProductToCart(pid)
        if(!indexProduct){
            return "Error al cargar el producto: no se encontro un producto con ese ID"
        } else {
                const modificada = await Carts.findByIdAndUpdate(cid, 
                    {$push: {products: {product: pid, quantity:1}}},
                    { new: true}).lean()
            
    
                return modificada
        }
    }

    async deleteCart(cid){
        const cart = await Carts.findById(cid)
        if (!cart) {
            throw new Error("no existe un carrito con ese id")
        }
    
        cart.products = []
    
        const eliminado = await cart.save()
        if (!eliminado) {
            throw new Error("Error al eliminar el contenido del carrito")
        }
        return `Se eliminó el contenido del carrito ${cid} con éxito`
    }

    /*async deleteCart(cid){
        const cart = await Carts.findByIdAndDelete(cid)
        .lean()

        return "eliminado con exito"
    }*/

    async deleteProductCart(cid, pid){
        const cart = await Carts.findById(cid)
        if (!cart) {
            throw new Error("no existe un carrito con ese id")
        }
        const searchProduct = cart.products.findIndex(p => p.product == pid)
        if(searchProduct === -1){
            throw new Error("no existe un producto con ese id en el carrito")
        }
        cart.products.splice(searchProduct, 1)
        const eliminado = await cart.save()
        if (!eliminado) {
            throw new Error("Error al eliminar el contenido del carrito")
        }
        return `Se eliminó el producto ${pid} del carrito ${cid} con éxito`
    }
}