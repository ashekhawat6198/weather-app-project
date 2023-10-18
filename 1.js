const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingContainer=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const grantButton=document.querySelector("[data-grantAccess]");




let currentTab=userTab;
userTab.classList.add("current-tab");
const API_KEY='4297b878b78bd1e8fec6d5ac839dfd85';

getLocalCoordinates();

function changeTab(clickTab){
    if(currentTab!=clickTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getLocalCoordinates();
        }
    }
}


userTab.addEventListener("click",function(){
    changeTab(userTab);
})

searchTab.addEventListener("click",function(){
    changeTab(searchTab);
})


function getLocalCoordinates(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeather(coordinates);
    }
}

async function fetchUserWeather(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingContainer.classList.add("active");

    try{
            const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const data= await response.json();
            loadingContainer.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderInfo(data);
    }
    catch(e){
      // HW
    }
}

function renderInfo(weatherInfo){

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const weatherDesc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");


         cityName.innerText=weatherInfo?.name;
          countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
          weatherDesc.innerText=weatherInfo?.weather?.[0]?.description;
          weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
          temp.innerText=`${weatherInfo?.main?.temp} °C`;
          windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
          humidity.innerText=`${weatherInfo?.main?.humidity} %`;
          cloudiness.innerText=`${weatherInfo?.clouds?.all} %`; 
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
    // HW
    }
}

function showPosition(position){
    const userCordinates={
                lat:position.coords.latitude,
                lon:position.coords.longitude,
            }

            sessionStorage.setItem("user-coordinates",JSON.stringify(userCordinates));
            fetchUserWeather(userCordinates);
}

grantButton.addEventListener("click",getLocation);
const inputValue=document.querySelector("[data-SearchInput]");

searchForm.addEventListener("submit",function(e){
    e.preventDefault();
    let cityName=inputValue.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeather(cityName);
    }
})


async function fetchSearchWeather(city){
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    loadingContainer.classList.add("active");
    try{
         const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
         const data=await response.json();
         loadingContainer.classList.remove("active");
         userInfoContainer.classList.add("active");
         renderInfo(data)
    }
    catch(e){

    }
}