const socket = io()

const contentProducts = document.querySelector('#contentProducts')

document.querySelector('form')?.addEventListener('submit', event => {
    event.preventDefault()
    const title = document.getElementById("productTitle")
    const description = document.getElementById("productDescription")
    const category = document.getElementById("productCategory")
    const code = document.getElementById("productCode")
    const price = document.getElementById("productPrice")
    const stock = document.getElementById("productStock")

    if(title?.value && description?.value && category?.value && code?.value && price?.value && stock?.value){
        socket.emit("newProduct", {title: title?.value, description: description?.value, category: category?.value, code: code?.value, price: parseInt(price?.value), stock: parseInt(stock?.value)})
        title.value = ""
        description.value = ""
        category.value = ""
        code.value = ""
        price.value = ""
        stock.value = ""
    }

})

socket.on("products", products =>{
    if(contentProducts){
        contentProducts.innerHTML = ""
        for (const product of products) {
            contentProducts.innerHTML += `  <div class="card">
                                                <p>Producto: ${product.id}</p>
                                                <p>${product.title}</p>
                                                <p class="descriptionText">${product.description}</p>
                                                <p>Precio: ${product.price}</p>
                                                <p>Stock: ${product.stock}</p>
                                            </div>`
        }
    }
})