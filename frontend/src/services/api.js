const BASE_URL = "http://localhost:3000/api"

export function authRegister(registerForm) {
  return fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(registerForm)
  })
}

export function authLogin(loginForm) {
  console.log(loginForm)
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginForm)
  })
}