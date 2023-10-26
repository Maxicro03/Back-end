    const host = "localhost"
    const port = "8080"
    const path = "/products"
    const query = "description=Bebida"

    const url = `http://${host}:${port}${path}?${query}`

    console.log(`URL: ${url}`);

    const response = await fetch(url)
    const content = await response.json()
    console.log(content)
