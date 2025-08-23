const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetch24HHistory(location) {
  if (!location.lat || !location.lon) {
    return { chartDate: "", hourlyData: [] };
  }

  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dateString = yesterday.toISOString().split("T")[0];

    const maxRetries = 3;
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const res = await fetch(
          `/api/weather?endpoint=history.json&q=${location.lat},${location.lon}&dt=${dateString}`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          const text = await res.text();
          throw new Error(`API Error: ${res.status} - ${text.slice(0, 100)}`);
        }

        const data = await res.json();
        if (!data.forecast?.forecastday?.[0]?.hour) {
          throw new Error("Invalid data structure received");
        }

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
        lastError = error;
        if (attempt < maxRetries - 1) {
          const backoffTime = Math.min(1000 * Math.pow(2, attempt), 5000);
          await wait(backoffTime);
          continue;
        }
        console.error(
          `Weather API error (24H) - Attempt ${attempt + 1}/${maxRetries}:`,
          error
        );
        return { chartDate: "", hourlyData: [], error: error.message };
      }
    }
  } catch (error) {
    console.error("Weather API error (24H):", error);
    return { chartDate: "", hourlyData: [] };
  }
}
