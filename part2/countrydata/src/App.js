import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const Weather = ({ country }) => {
  const [weather, setWeather] = useState({
    current: {
      temperature: 0,
      weather_icons: [""],
      wind_speed: 0,
      wind_dir: 0,
    },
  });
  const api_key = process.env.REACT_APP_API_KEY;
  const [weatherIcon] = weather.current.weather_icons;

  useEffect(() => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, [api_key, country.capital]);

  return (
    <div>
      <h3>Weather in {country.capital}</h3>
      <p>
        <strong>temperature:</strong> {weather.current.temperature} Celcius
      </p>
      <img src={weatherIcon} alt="weather icon" />
      <br />
      <p>
        <strong>wind:</strong> {weather.current.wind_speed} mph direction{" "}
        {weather.current.wind_dir}
      </p>
    </div>
  );
};

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {country.languages.map((language) => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <img src={country.flag} className="flag" alt="flag" />
      <Weather country={country} />
    </div>
  );
};

const CountryArea = ({ countries, search, setSearch }) => {
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredCountries.length > 10)
    return <p>Too many matches, specify another filter</p>;

  if (filteredCountries.length === 1) {
    const [country] = filteredCountries;

    return <Country country={country} />;
  }

  return (
    <div>
      {filteredCountries.map((country) => (
        <p key={country.name}>
          {country.name}{" "}
          <button onClick={() => setSearch(country.name)}>show</button>
        </p>
      ))}
    </div>
  );
};

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>
      <CountryArea
        countries={countries}
        search={search}
        setSearch={setSearch}
      />
    </>
  );
}

export default App;
