import fs from "fs/promises"
import { Cart } from "../models/cart.js"
import { productsManager } from "./ProductsManager.js"

export class CartsManager {
    constructor(path){
        this.path = path
    }

    async #read () {
        try {
            this.carts = JSON.parse(await fs.readFile(this.path, "utf-8"))
        } catch {
            
        }
    }
    

    async #writeList() {
        this.#read()
        await fs.writeFile(this.path, JSON.stringify(this.carts))
    }

    #autoId () {
        this.#read()
        if (this.carts.length > 0) {
            return this.carts[this.carts.length - 1].id + 1
          } else {
            return 1
          }
    }

    getCart(){
        this.#read()
        if(this.carts.length === 0){
            return "Error en la busqueda: no se encontro ningun carrito"
        } else {
            return this.carts
        }
    }

    async getCartById(id){
        await this.#read()
        const index = this.carts.filter(c=> c.id === id)
        if (index.length === 0) {
            return "Error en la busqueda: no se encontro ningun carrito con ese ID"
        } else {
            const indexReturn = index[0].products
            if(indexReturn.length == []){
                return "El carrito se encuentra vacio"
            } else {
                return indexReturn
            }
        }

    }

    addCart(){
        this.#read()
        const id = this.#autoId()
        const cart = new Cart(id)
        this.carts.push(cart)
        this.#writeList()
        return cart
    }


    async addProductCart(cid, pid){
        await this.#read()
        const index = this.carts.filter(c=> c.id === cid)
        const indexPosition = this.carts.findIndex(c => c.id === cid)
        if (index.length === 0) {
            return "Error en la busqueda: no se encontro ningun carrito con ese ID"
        } else {
            const pm = productsManager
            const indexProduct = await pm.getProductToCart(pid)
            const indexObject = {...index}
            if(indexProduct[0] === undefined){
                return "Error al cargar el producto: no se encontro un producto con ese ID"
            } else {
                const repeat = indexObject[0].products.filter(p=> p.id === indexProduct[0].id)
                if(repeat.length !== 0){
                    const repeatPosition = indexObject[0].products.findIndex(p=> p.id === indexProduct[0].id)
                    const addStock = repeat[0].quantity + 1
                    const productCart = {
                        id: indexProduct[0].id,
                        quantity: addStock
                    }
                    indexObject[0].products.splice(repeatPosition, 1)
                    indexObject[0].products.splice(repeatPosition, 0, productCart)
                    this.#writeList()
                    return this.carts
                } else {
                    const productCart = {
                        id: indexProduct[0].id,
                        quantity: 1
                    }
                    indexObject[0].products.push(productCart)
                    this.carts.splice(indexPosition, 1)
                    this.carts.splice(indexPosition, 0, ...index)
                    this.#writeList()
                    return this.carts
                }
            }
        }
    }
}