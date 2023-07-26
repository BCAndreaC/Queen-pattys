function getUsers () {
    const token = localStorage.getItem('token');
    return fetch('https://burger-queen-api-mock-production-9d92.up.railway.app/users', {
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

function postUser(email: string, password: string, role: string): Promise<object> {
    if(!email|| !password || !role) {
        console.error('Error: email, password and role are required')
    }
    const token = localStorage.getItem('token');
    return fetch('https://burger-queen-api-mock-production-9d92.up.railway.app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email: email,
            password: password,
            role: role,
        })
    })
    .then(response =>{
        return response.json()
    })
    .then(data => {
        if(typeof data === "string") {
            console.error(data)
            throw new Error(data);
        } else {
            return data
        }}
    );
}

function patchUsers(id: number, email: string, password: string, role: string): Promise<object>  {
    if(!email|| !password || !role) {
        console.error('Error: email, password and role are required')
    }
    const token = localStorage.getItem('token');
    return fetch(`https://burger-queen-api-mock-production-9d92.up.railway.app/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email: email, 
            password: password, 
            role: role,
        })
    })
    .then(response =>{
        return response.json()
    })
    .catch(error =>{
        console.error('Error sending order:', error);
    });
}

function deleteUsers(id: number) {
    const token = localStorage.getItem('token');
    return fetch(`https://burger-queen-api-mock-production-9d92.up.railway.app/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
    })
    .then(response =>{
        return response.json()
    })
    .catch(error =>{
        console.error('Error sending order:', error);
    });
}

// postUser('nuevonuevo@hotmail.com', '123456', 'admin')

export { getUsers, postUser, patchUsers, deleteUsers }