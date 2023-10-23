const productosCargar = [{titulo:"Jamon", descripcion: "Comida", precio: 1500, thumbnail: "jamon.jpg", stock: 20},{titulo:"Queso", descripcion: "Comida", precio: 1200, thumbnail: "queso.jpg", stock: 15},{titulo:"Salame", descripcion: "Comida", precio: 1000, thumbnail: "salame.jpg", stock: 10}]


class Product{
    constructor(id, title, description, price, thumbnail, stock){
        this.id = id
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.stock = stock 
    }
}

class ProductManager{
    static idIncrementable = 1
    #products

    constructor(){
        this.#products = []
    }

    getProducts = () =>{
        return this.#products
    }

    getProductId = (id) =>{
        let buscarId = this.#products.filter(producto => producto.id === id)
        if (buscarId != 0) {
            return buscarId
        }
        else{
            return ("No se encontro el producto")
        }
    }

    static obtenerId() {
        return ProductManager.idIncrementable++
    }

    addProduct = (datosProducto) => {
        const idProducto = ProductManager.obtenerId()
        const productoExistente = this.#products.find(producto => producto.id === idProducto)
        if (productoExistente) {
            console.log("El producto ya existe con ese identificador")
        } else {
            const agregarProducto = new Product(idProducto, datosProducto.title,
                datosProducto.description,
                datosProducto.price,
                datosProducto.thumbnail,
                datosProducto.stock)
            this.#products.push(agregarProducto)
            return agregarProducto
        }
    }


}

const handProducts = new ProductManager()

for (let i = 0; i < productosCargar.length; i++) {
    const agregarProducto = handProducts.addProduct({
        title: `${productosCargar[i].titulo}`,
        description: `${productosCargar[i].descripcion}`,
        price: `${productosCargar[i].precio}`,
        thumbnail: `${productosCargar[i].thumbnail}`,
        stock: `${productosCargar[i].stock}`
    })
    console.log(agregarProducto)
}

console.log(handProducts.getProducts())

console.log(handProducts.getProductId(3))


