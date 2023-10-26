import fs from "fs/promises"

export class ProductManager {
    constructor(path){
        this.path = path     
    }

    async #read() {
        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
      }

    async getProducts(){
        await this.#read()
        return this.products
    }

    async getProductByid(id){
        await this.#read()
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
            return this.products[index]
        } else {
            return 'error al buscar: producto no encontrado por id'
        }
    }

    async getProductByDescription(description){
        await this.#read()
        return  this.products.filter(p => p.descripcion === description)
    }
}