import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const productsSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    code: {type: String, required: true},
    price: {type: Number, required: true},
    status: {type: Boolean, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true}
}, {
    versionKey: false,
    strict: "throw"
})

productsSchema.plugin(mongoosePaginate)

export const Products = mongoose.model("products", productsSchema)
