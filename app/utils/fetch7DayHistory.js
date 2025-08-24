export async function fetch7DayHistory(location) {
  if (!location.lat || !location.lon) {
    return [];
  }

  const datePromises = [];

  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    const promise = fetch(
      `https://api.weatherapi.com/v1/history.json?key=7a559a0e1aec4d6cbc8143504250708&q=${location.lat},${location.lon}&dt=${dateString}`
    ).then(res => {
      if (!res.ok) {
        return res.json().then(err => Promise.reject(err));
      }
      return res.json();
    });

    datePromises.push(promise);
  }

  const results = await Promise.all(datePromises);
  return results.map(result => result.forecast.forecastday[0]);
}
