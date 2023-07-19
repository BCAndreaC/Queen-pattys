export function patchOrders(id: number) {
    const token = localStorage.getItem('token');
    return fetch(`http://localhost:8080/users/${id}`, {
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
    .then(data => 
        console.log(data, 'AQUI PEDIDO CON DELIVERING!!!! '))
    .catch(error =>{
        console.error('Error sending order:', error);
    });
}