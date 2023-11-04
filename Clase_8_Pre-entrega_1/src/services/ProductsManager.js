import fs from "fs/promises"
import { Product } from "../models/Product.js"

export class ProductsManager {
    constructor(path){
        this.path = path
    }

    async #read () {
       this.products = JSON.parse(await fs.readFile(this.path, "utf-8"))
    }

    async #writeList() {
        await this.#read()
        await fs.writeFile(this.path, JSON.stringify(this.products))
    }

    async #autoId () {
        await this.#read()
        if (this.products.length > 0) {
            return this.products[this.products.length - 1].id + 1
          } else {
            return 1
          }
    }

    async getProducts() {
        await this.#read()
        return this.products
    }
    
    async getProductsById(id) {
        await this.#read()
        const index = this.products.filter(p => p.id === id)
        console.log(index);
        if(index.length === 0){
            return "Error en la busqueda: no se encontro ningun producto con ese id"
        } else {
            return index
        }
    }

    async addProduct({dateProducts}){
        console.log(dateProducts)
        await this.#read()
        const id = this.#autoId()
        const product = new Product({id, ...dateProducts, })
        this.products.push(product)
        await this.#writeList()
        return product
    }

    async updateProduct({id, dateProductUpdate}){
        await this.#read()
        const index = this.products.filter(p => p.id === id)
        if(index.length === 0){
            return "Error en la busqueda: no se encontro ningun producto con ese id"
        } else {
            for (let i = 0; i < dateProductUpdate.length; i++) {
                const productToUpdate = this.products[index]
                const update = dateProductUpdate[i]
                const searchUpdate = productToUpdate.filter(p => p.key = update.key)
                if(searchUpdate.length === 0){
                    return "Error al actualizar"
                } else {
                    searchUpdate.key = update.value
                }
                
                productToUpdate.value = update.value
            }
            
        }

    }
}