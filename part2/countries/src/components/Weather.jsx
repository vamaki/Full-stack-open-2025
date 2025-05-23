import axios from 'axios'
import { useState, useEffect } from 'react'

const Weather = ({city}) => {
  const api_key = import.meta.env.VITE_WEATHER_API
  const [temp, setTemp] = useState(0)
  const [wind, setWind] = useState(0)
  const [icon, setIcon] = useState('')
  const [iconAlt, setIconAlt] = useState('')
  useEffect(() => {
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`)
    .then((response )=> {
      setTemp(response.data.main.temp-272.2)
      setWind(response.data.wind.speed)
      setIcon(response.data.weather[0].icon)
      setIconAlt(response.data.weather[0].description)
    })
    console.log(temp, wind, icon)
  }, [city])
  console.log(city)
  console.log(temp, wind, icon)
  return (
    <>
      <h2>Weather in {city}</h2>
      <p>Temperature {Math.round(temp * 100) / 100} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={iconAlt}/>
      <p>Wind {wind} m/s</p>
    </>
  )
}

export default Weather