function getOrders() {
    const token = localStorage.getItem('token');
    return fetch('https://burger-queen-api-mock-production-9d92.up.railway.app/orders', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    })
    .then(response => {
        return response.json()
    })
    .catch(error => {
        console.error('Error fetching products:', error)
    })
}

 function postOrders(order: object) {
    const token = localStorage.getItem('token');
    return fetch('https://burger-queen-api-mock-production-9d92.up.railway.app/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(order)
    })
    .then(response =>{
        return response.json()
    })
    .catch(error =>{
        console.error('Error sending order:', error);
    });
}

 function patchOrders(id: number) {
    const token = localStorage.getItem('token');
    return fetch(`https://burger-queen-api-mock-production-9d92.up.railway.app/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            status: 'Delivering',
            dataProcessed: new Date()
        })
    })
    .then(response =>{
        return response.json()
    })
    .catch(error =>{
        console.error('Error sending order:', error);
    });
}

 function patchDelivers(id: number) {
    const token = localStorage.getItem('token');
    return fetch(`https://burger-queen-api-mock-production-9d92.up.railway.app/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            status: 'Delivered',
            dataProcessed: new Date()
        })
    })
    .then(response =>{
        return response.json()
    })
    .catch(error =>{
        console.error('Error sending order:', error);
    });
}

export { getOrders, postOrders, patchOrders, patchDelivers}