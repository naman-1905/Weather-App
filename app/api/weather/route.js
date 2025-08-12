import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      console.error("FATAL: WEATHER_API_KEY environment variable is not set on the server. Please check your .env.local file and restart the server.");
      return NextResponse.json({ error: 'Server configuration error: API key is missing.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json({ error: "The 'endpoint' parameter is required" }, { status: 400 });
    }

    const params = new URLSearchParams(searchParams);
    params.delete('endpoint');
    params.append('key', apiKey);

    const targetUrl = `https://api.weatherapi.com/v1/${endpoint}?${params.toString()}`;

    const apiResponse = await fetch(targetUrl, {
      next: { revalidate: 600 } 
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error("External API Error Response:", data);
      return NextResponse.json({ error: data.error || 'Failed to fetch data from WeatherAPI' }, { status: apiResponse.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("A critical error occurred in the weather API proxy route:", error);
    return NextResponse.json({ error: 'Internal Server Error in proxy route. Check server logs for details.' }, { status: 500 });
  }
}
