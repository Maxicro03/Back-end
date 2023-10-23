const {promises: fs} = require("fs")


class Product {
    constructor({id, titulo, descripcion, precio, imagen, code, stock}){
        this.id = id
        this.titulo = titulo
        this.descripcion = descripcion
        this.precio = precio
        this.imagen = imagen
        this.code = code
        this.stock = stock
    }
}

class ProductManager {
    #product
    constructor({ruta}){
        this.ruta = ruta
        this.#product = []
    }

    #autoId () {
        if (this.#product.length > 0) {
            return this.#product[this.#product.length - 1].id + 1
          } else {
            return 1
          }
    }

    async reset() {
        this.#product = []
        await this.#escribirLista()
      }

    async #leerLista () {
        const ProductsEnJson = await fs.readFile(this.ruta, "utf-8")
        this.#product = JSON.parse(ProductsEnJson)
    }

    async #escribirLista() {
        await fs.writeFile(this.ruta, JSON.stringify(this.#product))
    }

    async addProduct({titulo, descripcion, precio, imagen, code, stock}) {
        await this.#leerLista()
        const id = this.#autoId()
        const product = new Product({id, titulo, descripcion, precio, imagen, code, stock})
        this.#product.push(product)
        await this.#escribirLista()
        return product
    }

    async getProducts() {
        await this.#leerLista()
        return this.#product
    }

    async getProductByid(id) {
        await this.#leerLista()
        const index = this.#product.findIndex(p => p.id === id)
        if (index !== -1) {
            return this.#product[index]
        } else {
            throw new Error('error al buscar: usuario no encontrado')
        }
    }

    async updateProduct(id, productData) {
        await this.#leerLista()
        const index = this.#product.findIndex(u => u.id === id)
        if (index !== -1) {
        const nuevoProd = new Product({ id, ...this.#product[index], ...productData })
        this.#product[index] = nuevoProd
        await this.#escribirLista()
        return nuevoProd
        } else {
        throw new Error('error al actualizar: usuario no encontrado')
        }
    }
    
    async deleteProduct(id){
        await this.#leerLista()
        const index = this.#product.findIndex(p => p.id === id)
        if (index !== -1) {
        const arrayConLosBorrados = this.#product.splice(index, 1)
        await this.#escribirLista()
        return arrayConLosBorrados[0]
        } else {
        throw new Error('error al borrar: usuario no encontrado')
        }
  }
    
}

async function main() {
    const pm = new ProductManager({ ruta: 'products.json' })
    pm.reset()
  
    console.log('agregado: ', await pm.addProduct({
      titulo: 'Jamon',
      descripcion: 'Comida',
      precio: 1500,
      imagen: 'Jamon.jpg',
      code: "A12",
      stock: 30
    }))
  
    console.log('agregado: ', await pm.addProduct({
        titulo: 'Queso',
        descripcion: 'Comida',
        precio: 1200,
        imagen: 'Queso.jpg',
        code: "A20",
        stock: 40
    }))

    console.log('agregado: ', await pm.addProduct({
        titulo: 'Salame',
        descripcion: 'Comida',
        precio: 1000,
        imagen: 'Salame.jpg',
        code: "A15",
        stock: 20
    }))
  
    console.log('obtenidos: ', await pm.getProducts())
    console.log('obtenidos: ', await pm.getProductByid(3))
  
    console.log('actualizado: ', await pm.updateProduct(1, { stock: 20 }))
    console.log('borrado: ', await pm.deleteProduct(2))
  
    console.log('obtenidos: ', await pm.getProducts())
  }
  
  main()