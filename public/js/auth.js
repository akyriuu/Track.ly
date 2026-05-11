const API = "";
const btnLogin = document.getElementById("btn-login");
const btnRegister = document.getElementById("btn-register");
const errorMsg = document.getElementById("error-msg");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = "block";
}
function hideError() {
    errorMsg.style.display = "none";
}
async function login() {
    hideError();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password)
        return showError("Preencha todos os campos.");
    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok)
        return showError(data.error || "Erro ao fazer login.");
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
}
async function register() {
    hideError();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password)
        return showError("Preencha todos os campos.");
    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok)
        return showError(data.error || "Erro ao criar conta.");
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
}
btnLogin.addEventListener("click", login);
btnRegister.addEventListener("click", register);
export {};
