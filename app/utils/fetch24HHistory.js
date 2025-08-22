export async function fetch24HHistory(location) {
  if (!location.lat || !location.lon) {
    return { chartDate: "", hourlyData: [] };
  }

  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dateString = yesterday.toISOString().split("T")[0];

    const res = await fetch(
      `/api/weather?endpoint=history.json&q=${location.lat},${location.lon}&dt=${dateString}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Failed to fetch data");
    }

    const data = await res.json();

    const hourlyData = data?.forecast?.forecastday?.[0]?.hour || [];

    return {
      chartDate: yesterday.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      hourlyData,
    };
  } catch (error) {
    console.error("Weather API error (24H):", error);
    return { chartDate: "", hourlyData: [] };
  }
}
