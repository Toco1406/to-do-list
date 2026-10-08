const BASE_URL = "http://localhost:3000/api/auth"

const jsonPost = (path, body) =>
  fetch(`${BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

// Prévient le Header que l'état de connexion a changé
const notifyAuthChange = () => window.dispatchEvent(new Event("auth-change"))

export function authRegister(registerForm) {
  return fetch(`${BASE_URL}/register`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(registerForm)
  })
}

export function authLogin(loginForm) {
  console.log(loginForm)
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginForm)
  })
}

export async function authLogout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  })
  notifyAuthChange()
  return res
}

export function authMe() {
  return fetch(`${BASE_URL}/auth/me`, { credentials: "include" })
}