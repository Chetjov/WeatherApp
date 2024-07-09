import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Nezapomeňte naimportovat CSS soubor

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [showRoom, setShowRoom] = useState({});
  const [showData, setShowData] = useState(false);
  const [time, setTime] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 120000); // 120000 ms = 2 minut
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCity !== "" && weatherData.length > 0) {
      const cityData = weatherData.find(
        (item) => item.location === selectedCity
      );
      if (cityData) {
        setShowRoom(cityData);
        setShowData(true);
      }
    }
  }, [weatherData, selectedCity]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString();
  };

  const getData = () => {
    axios
      .get("https://springw.azurewebsites.net/weather")
      .then(function (response) {
        setWeatherData(response.data);
        setTime(getCurrentTime());
      })
      .catch(function (error) {
        const alertMessage = `API nedostupné: ${error}`;
        alert(alertMessage);
        console.error("There was an error!", error);
      });
  };

  const handleChange = (e) => {
    let city = e.target.value;
    if (city !== "label") {
      setShowRoom(weatherData.find((item) => item.location === city));
      setShowData(true);
      setSelectedCity(city);
    } else {
      setShowData(false);
      setSelectedCity("");
    }
  };

  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <header className="row my-5 text-center">
        <h1 className="display-3">WeatherApp</h1>
      </header>

      <section className="row my-5">
        <div className="col-md-6 mx-auto">
          <select className="form-select" onChange={handleChange}>
            <option value="label">vyberte město</option>
            {weatherData.map((item, index) => (
              <option key={index} value={item.location}>
                {item.location}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="row my-2">
        <p className="col-md-6 mx-auto text-center text-danger">
          Aktualizováno: {time}
        </p>
      </section>

      {showData && (
        <section className="row my-5">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-body">
                <h2 className="display-6">{showRoom.location}</h2>
                <p>
                  <strong>Čas:</strong> {showRoom.timestamp}
                </p>
                <p>
                  <strong>Teplota:</strong> {showRoom.temp_celsius}°C
                </p>
                <p>
                  <strong>Rel. vlhkost:</strong> {showRoom.rel_humidity} %
                </p>
                <p>
                  <strong>Rychlost větru:</strong> {showRoom.windSpeed_mps} mi/h
                </p>
                <p>
                  <strong>Směr větru:</strong> {showRoom.windDirection}
                </p>
                <p>
                  <strong>Počasí:</strong> {showRoom.weatherDescription}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
