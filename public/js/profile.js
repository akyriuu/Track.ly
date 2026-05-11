const API = "http://localhost:2004";
const token = localStorage.getItem("token");
if (!token)
    window.location.href = "index.html";
async function apiFetch(endpoint, options) {
    const res = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
    return res.json();
}
async function loadProfile() {
    const data = await apiFetch("/me");
    const avatar = document.getElementById("user-avatar");
    const username = document.getElementById("profile-username");
    const date = document.getElementById("profile-date");
    const lastfmInput = document.getElementById("lastfm-username");
    avatar.textContent = data.username.charAt(0).toUpperCase();
    username.textContent = data.username;
    date.textContent = `Membro desde ${new Date(data.createdAt).toLocaleDateString("pt-BR")}`;
    if (!data.lastfmUsername) {
        const errorMsg = document.getElementById("error-msg");
        errorMsg.textContent =
            "Vincule seu usuário Last.fm para ver suas estatísticas.";
        errorMsg.style.display = "block";
    }
}
document.getElementById("btn-save")?.addEventListener("click", async () => {
    const lastfmUsername = document.getElementById("lastfm-username").value.trim();
    const errorMsg = document.getElementById("error-msg");
    const successMsg = document.getElementById("success-msg");
    errorMsg.style.display = "none";
    successMsg.style.display = "none";
    if (!lastfmUsername) {
        errorMsg.textContent = "Preencha o usuário do Last.fm.";
        errorMsg.style.display = "block";
        return;
    }
    const res = await apiFetch("/me", {
        method: "PATCH",
        body: JSON.stringify({ lastfmUsername }),
    });
    if (res.error) {
        errorMsg.textContent = res.error;
        errorMsg.style.display = "block";
        return;
    }
    successMsg.style.display = "block";
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);
});
document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});
loadProfile();
export {};
