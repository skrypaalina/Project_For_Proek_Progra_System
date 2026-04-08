const BASE_URL = "http://127.0.0.1:8000";

export async function api(url) {
    const res = await fetch(BASE_URL + url);
    return res.json();
}