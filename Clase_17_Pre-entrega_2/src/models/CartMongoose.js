import mongoose from "mongoose"

const cartsSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    products: [{
        _id: false,
        product: { type: String, ref: "products" },
        quantity: { type: Number, default: 1 },
    }],
}, {
    versionKey: false,
    strict: "throw"
})

cartsSchema.pre('find', function(next){
    this.populate({
        path: 'products.product',
        select: 'title price',
    })
    next()
})



export const Carts = mongoose.model("carts", cartsSchema)