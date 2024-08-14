import { useState , useEffect} from 'react'
import PropTypes from "prop-types";

import './App.css'
//import all images for app
import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/clouds.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/humi.png";
import mistIcon from "./assets/mist.png";
import rainIcon from "./assets/rain.png";
import snowIcon from "./assets/snow.png";
import windIcon from "./assets/windd.png";

//component for weather details
const WeatherDetails =({icon,temp,city,country,lat,lon,wind,humidity})=>{
  return(
    <>
    {/* //define every element in app */}
      <div className='image'>
        <img src={icon} alt="image" />

      </div>
      <div className='temp'>
        {temp}°C
      </div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'> latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='lon'>longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>

           <img src={humidityIcon} alt="humidity" className='icon' />
           <div className='data'>
            <div className='humidity-percentage'>{humidity}% </div>
            <div className='text'>Humidity</div>
           </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="wind" className='icon' />
          <div className='data'>
            <div className='wind-percentage'>{wind}km/h</div>
            <div className='text'>Wind speed</div>
          </div>
        </div>
      </div>
    </>
  );

};

//defiine proptypes
WeatherDetails.propTypes ={
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  win: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
}
 
//define app function

function App() {

  let api_key="1a5f5c8d0fc77cd4f36c351712d7a2c4";   //api key for weather

  // defined all useState used in the component
  const [text, setText ]=useState("chennai");



  const [icon , setIcon]=useState(snowIcon);
  const [temp , setTemp]=useState(0);
  const [city , setCity]=useState("");
  const [country , setCountry]=useState("");
  const [lat , setLat]=useState(0);
  const [lon , setLon]=useState(0);
  const [humidity,setHumidity]=useState(0);
  const [wind,setWind]=useState(0);

  const [cityNotFound, setCityNotFound]=useState(false);
  const [loading, setLoading]=useState(false);
  const[error,setError]=useState(null);

  //defined weather icon code

  const weatherIconMap  ={
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n":drizzleIcon,
    "04d": drizzleIcon,
    "04n":drizzleIcon,
    "09d": rainIcon,
    "09n":rainIcon,
    "10d": rainIcon,
    "10n":rainIcon,
    "13d": snowIcon,
    "13n":snowIcon,


  };

  //asynchronous func to fetch api in app

  const search = async ()=>{
    setLoading(true);
    
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res=await fetch(url);
      let data= await res.json();
      if(data.cod === "404"){
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      // set all useState with api values
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      const weatherIconCode =data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);

    }catch(error){
      console.error("An error occurred:" ,error.message);
      setError("An error occurred while fetching data");
    }finally{
      setLoading(false);
    }
    

  };

  //handle search in input
  const handleCity =(e) =>{
    setText(e.target.value)
  };
  const handleKeyDown =(e)=>{
    if(e.key === "Enter"){
      search();
    }
 };

 //for automatic update
 useEffect(function(){
  search();
 },[]);

 //return weather details

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='Search City' onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
          <div className='search-icon' onClick={()=>search()}>
             <img src={searchIcon} alt="search" />
          </div>

        </div>
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} lon={lon} humidity={humidity} wind={wind} />}
        {loading && <div className='loading-message'>Loading....</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City Not Found</div>}
      </div>
       
    </>
  )
}

export default App
