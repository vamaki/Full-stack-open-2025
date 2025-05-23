import Weather from "./Weather"

const Countries = ({countriesFiltered, handleShowInfo}) => {

  if (countriesFiltered.length > 10) {
    return (
      <p>Too many countries, specify another filter</p>
    )
  } else if (countriesFiltered.length === 1) {
    const country = countriesFiltered[0]
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>
          Capital {country.capital[0]}<br/>
          Area {country.area}
        </p>
        <h2>Languages</h2>
        <ul>{Object.values(country.languages).map((lang =>
          <li key={lang}>
            {lang}
          </li>
          ))}
        </ul>
        <img className='flag' src={country.flags.svg} alt={country.flags.alt} />
        <Weather city={country.capital[0]} />
      </div>
    )
  }
  return (
    countriesFiltered.map(country =>
      <p key={country.ccn3}>
        {country.name.common}
        <button onClick={() => handleShowInfo(country)}>Show</button>
      </p>
    )
  )
}

export default Countries