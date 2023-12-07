import fs from "fs/promises"
import { Product } from "../models/Product.js"

export class ProductsManagerArchivo {
    constructor(path){
        this.path = path
    }

    async #read () {
        try {
            this.products = JSON.parse(await fs.readFile(this.path, "utf-8"))
        } catch {
            
        }
    }

    async #writeList() {
        this.#read()
        await fs.writeFile(this.path, JSON.stringify(this.products))
    }

    #autoId () {
        this.#read()
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

    getProductsByLimit(limit) {
        this.#read()
        const index = this.products
        if(limit <= 0) {
            return "Error al buscar los productos"
        } else {
            return index.slice(0, limit)
        }
    }
    
    getProductsById(id) {
        this.#read()
        const index = this.products.filter(p => p.id === id)
        if(index.length === 0){
            return "Error en la busqueda: no se encontro ningun producto con ese id"
        } else {
            return index
        }
    }

    async addProduct(dateProducts){ //lo que se hace en el addProduct es agarrar el objeto dateProduct y con ayuda del form se ordenan las categorias en this.dateProductFinaly por si se envian en un orden que no es el original se acomoden
        await this.#read()
        const id = this.#autoId()
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
        const product = new Product({id, ...dateLoading})
        this.products.push(product)
        await this.#writeList()
        return product
    }

    async updateProduct(id, dateProductUpdate){
        await this.#read()
        const indexPosition = this.products.findIndex(p => p.id === id)
        const index = this.products.filter(p => p.id === id)
        if(index.length === 0){
            return "Error en la busqueda: no se encontro ningun producto con ese ID"
        } else {
            const keys = (Object.keys(dateProductUpdate))
            const keysLength = keys.length
            const indexObject = {...index}
            for (let i = 0; i < keysLength; i++) {
                if (indexObject[0][keys[i]] === undefined) {
                    return "Error al actualizar: alguno de los campos asignados no se encontro"
                } else {
                    indexObject[0][keys[i]] = dateProductUpdate[keys[i]]
                }
            }
            this.products.splice(indexPosition, 1)
            this.products.splice(indexPosition, 0, ...index)
            await this.#writeList()
            return this.products
        }

    }

    async deleteProduct(id){
        await this.#read()
        const index = this.products.findIndex(p => p.id === id)
        if (index === -1) {
            return "Error en la busqueda: no se encontro ningun producto con ese ID"
        } else {
            this.products.splice(index, 1)
            await this.#writeList()
            return this.products
        }
        
    }

    async getProductToCart(pid){
        await this.#read()
         const index = this.products.filter(p => p.id === pid)
         if(index.length === 0 ){
            return false
        } else {
            return index
        }
    }
}