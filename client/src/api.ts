const apiUrl = 'http://localhost:3000';

export function login(data:{login: string, password: string}){
    return fetch(`${apiUrl}/sign-in`, {method: 'POST', body: JSON.stringify(data), headers: {'content-type': 'application/json'}})
}

export function getData(){
    return fetch(`${apiUrl}/hello`, {method: 'GET', headers: {'content-type': 'application/json', 'auth-token': localStorage.getItem('auth-token')}})
}