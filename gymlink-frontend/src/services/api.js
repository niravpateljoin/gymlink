export async function fetchBusinesses(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`http://localhost:8000/api/fitness?${params}`);
    return res.json();
  }
  