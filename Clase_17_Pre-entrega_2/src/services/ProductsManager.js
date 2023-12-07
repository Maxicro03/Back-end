//import { ProductsManagerArchivo } from "./ProductsManagerArchivos.js"
import { ProductsManagerMongoDb } from "./ProductsManagerMongoDb.js"

export const productsManager = new ProductsManagerMongoDb()