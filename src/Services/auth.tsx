// import { Navigate} from "react-router-dom";


export function loginAPI (options: object, setError:(error:string) => void) {
    let token = '';

    return fetch('https://burger-queen-api-mock-production-9d92.up.railway.app/login', options)
        .then(response => {
        if (!response.ok) {
            throw new Error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            }
            return response.json();
        })
        .then(data => {
            token = data.accessToken;
            localStorage.setItem('token', token)
            const role = data.user.role;
            localStorage.setItem('role', role)
            return {token, role}
            // Aquí puedes realizar acciones adicionales con el token
        })
        .catch(error => {
            console.error(error)
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales')
            // throw error;
        });
}

