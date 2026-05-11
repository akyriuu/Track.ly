const API = "";
const token = localStorage.getItem("token");
if (!token)
    window.location.href = "index.html";
async function apiFetch(endpoint) {
    const res = await fetch(`${API}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
    return res.json();
}
async function loadNowPlaying() {
    const content = document.getElementById("now-playing-content");
    const data = await apiFetch("/me/now-playing");
    if (data.isPlaying) {
        content.innerHTML = `
      <img src="${data.cover}" alt="cover" />
      <div class="now-playing-info">
        <span class="badge">● Agora</span>
        <span class="track-name">${data.name}</span>
        <span class="artist">${data.artist}</span>
        <span class="album">${data.album}</span>
      </div>
    `;
    }
    else {
        content.innerHTML = `<p class="loading">Nenhuma música tocando no momento.</p>`;
    }
}
async function loadStats() {
    const artistsList = document.getElementById("artists-list");
    const tracksList = document.getElementById("tracks-list");
    const data = await apiFetch("/me/stats");
    artistsList.innerHTML = data.topArtists
        .map((a) => `
      <li>
        <span>${a.name}</span>
        <span class="plays">${a.playcount} plays</span>
      </li>
    `)
        .join("");
    tracksList.innerHTML = data.topTracks
        .map((t) => `
      <li>
        <span>${t.name}</span>
        <span class="plays">${t.playcount} plays</span>
      </li>
    `)
        .join("");
}
async function loadAvatar() {
    const avatar = document.getElementById("user-avatar");
    const data = await apiFetch("/me");
    if (!data.lastfmUsername) {
        window.location.href = "profile.html";
        return;
    }
    avatar.textContent = data.username.charAt(0).toUpperCase();
}
document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});
loadNowPlaying();
loadAvatar();
loadStats();
export {};
