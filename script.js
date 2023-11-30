const wrapper=document.querySelector(".wrapper"),
inputPart=wrapper.querySelector(".input-part"),
infoText=inputPart.querySelector(".info-text"),
inputField=inputPart.querySelector("input"),
locationBtn=inputPart.querySelector("button");
WIcon=wrapper.querySelector(".weather-part img"),
arrowBack=wrapper.querySelector("header i");

let api;
let apiKey="19c696fc1c71043a08ab1e9522961999";

inputField.addEventListener("keyup",e => {
    // If user presed enter btn and input value is not empty
    if(e.key=="Enter" && inputField.value!=""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if(navigator.geolocation){  // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position){
  //  console.log(position);
  
  const {latitude, longitude} =position.coords; // getting lat and lon of the user device from coords obj
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&unit=metric&appid=${apiKey}`; //&lang={lang}
  fetchData();
}


function onError(error){
    //console.log(error);
    infoText.innerText=error.message;
    infoText.classList.add("error");
}

function requestApi(city){
    api=`https://api.openweathermap.org/data/2.5/weather?q=${city}&unit=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData(){
    infoText.innerText="Getting Weather Details...";
    infoText.classList.add("pending");
    // getting api response and returning it with parsing into js obj and in another
    // then function calling weatherDeatails function with passing api results as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    infoText.classList.replace("pending","error");
    if(info.cod == "404"){
        infoText.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        // Lets get required properties value from the info object
        const city=info.name;
        const country=info.country;
        const {description,id}=info.weather[0];
        const {feels_like,humidity,temp}=info.main;

        // using custom icon according to the id when api return us
        if(id == 800){
            WIcon.src="images/clear.png"
        }
        else if(id >= 200 && id<=232){
            WIcon.src="images/strom.png"
        }
        else if(id == 600 && id<=632){
            WIcon.src="images/snow.png"
        }
        else if(id == 701 && id<=781){
            WIcon.src="images/haze.png"
        }
        else if(id == 801 && id<=804){
            WIcon.src="images/cloud.png"
        }
        else if((id>=300 && id<=321) || (id>=500 && id<=531)){
            WIcon.src="images/rain.png"
        }

        // let's pass these values to a particula html element
        wrapper.querySelector(".temp .numb").innerText=Math.floor(temp);
        wrapper.querySelector(".weather").innerText=description;
        wrapper.querySelector(".location span").innerText=`${city},${country}`;
        wrapper.querySelector(".temp .numb-2").innerText=Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText=`${humidity}%`;


        infoText.classList.remove("pending","error");
        wrapper.classList.add("active");
        //console.log(info);
    }
}

arrowBack.addEventListener("click",() => {
    wrapper.classList.remove("active");
});