
function fetchProducts () {
    const token = localStorage.getItem('token');
    return fetch('https://burger-queen-api-mock-production-9d92.up.railway.app/products', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    })
    .then(response => {
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching products:', error)
    })
}

function postProducts(name: string, price: number, type: string) : Promise<object> | Promise <void>{
    if(!name || !price || !type){ 
        console.error('Error: missing data');
    }
    const token = localStorage.getItem('token');
    return fetch('https://burger-queen-api-mock-production-9d92.up.railway.app/products', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name,
            price: price,
            type: type,
        })
    })
    .then(response =>{
        return response.json()
    })
    .catch(error =>{
        console.error('Error sending product:', error);
    });
}


function deleteProduct(id: number | null){
    const token = localStorage.getItem('token');
    return fetch(`https://burger-queen-api-mock-production-9d92.up.railway.app/products/${id}`, {
        method: 'DELETE',
        headers: {
            'contentType': 'application/json',
            'authorization': `Bearer ${token}`
        }
})
.then(response =>{
    return response.json()
})
.catch(error =>{
    console.error('Error deleting product:', error);
});
}

function patchProducts(id: number, name: string, price: number, type: string): Promise<object> {
    if(!name || !price || !type){ 
        console.error('Error: missing data');
    }
    const token = localStorage.getItem('token');
    return fetch(`https://burger-queen-api-mock-production-9d92.up.railway.app/products/${id}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name, 
            price: price,
            type: type,
        })
    })
    .then(response =>{
        return response.json()
    })
    .catch(error =>{
        console.error('Error updating product:', error);
    });
}

export { fetchProducts, postProducts, deleteProduct, patchProducts };