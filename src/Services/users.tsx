function getUsers () {
    const token = localStorage.getItem('token');
    return fetch('http://localhost:8080/users', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    })
    .then(response => {
        return response.json();
    })
    // .then(data => {
    //     console.log(data, 'AQUI USERS!!!')
    // })
    .catch(error => {
        console.error('Error fetching products:', error)
    })
}

function postUser(email: string, password: string, role: string): Promise<object> {
    if(!email|| !password || !role) {
        console.error('Error: email, password and role are required')
    }
    const token = localStorage.getItem('token');
    return fetch('http://localhost:8080/users', {
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
    return fetch(`http://localhost:8080/users/${id}`, {
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
    // .then(data => 
    //     console.log(data, 'AQUI USUARIO EDITADO!!!! '))
    .catch(error =>{
        console.error('Error sending order:', error);
    });
}

function deleteUsers(id: number) {
    const token = localStorage.getItem('token');
    return fetch(`http://localhost:8080/users/${id}`, {
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