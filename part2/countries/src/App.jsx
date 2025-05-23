import { useEffect, useState } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

function App() {
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  useEffect(() => {
    axios.get(`${baseUrl}/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleShowInfo = (country) => {
    setSelectedCountry(country)
  }

  useEffect(() => {
    setSelectedCountry(null)
  }, [filter])
  const countriesFiltered = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
      {selectedCountry ? (
        <Countries countriesFiltered={[selectedCountry]} handleShowInfo={handleShowInfo} />
      ) : (
        <Countries countriesFiltered={countriesFiltered} handleShowInfo={handleShowInfo}/>
      )}
    </div>
  )
}

export default App
