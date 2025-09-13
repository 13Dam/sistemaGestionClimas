import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = process.env.WEATHER_API_URL;

export async function getWeather(city) {
  const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener la información del clima");
  const data = await res.json();

  return {
    city: data.location.name,
    temp_c: data.current.temp_c,
    timestamp: new Date(data.current.last_updated).toISOString()
  };
}
