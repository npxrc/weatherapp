function $(e){
    if (e.startsWith('.')){
        return document.querySelector(e)
    }
    return document.getElementById(e)
}


let fetchingFeedback;
let secondsSinceFetch=0;
function getLocation(){
    try{
        $('current').innerHTML="Fetching (0s elapsed)"
        fetchingFeedback = setInterval(() => {
            secondsSinceFetch+=1;
            $('current').innerHTML=`Fetching... (${secondsSinceFetch}s elapsed)`
            if (secondsSinceFetch==5){
                navigator.geolocation.watchPosition(setup, fail)
            }
        }, 1000);
        if (navigator.geolocation){
            console.log('Requesting Geolocation API at '+secondsSinceFetch+'s')
            navigator.geolocation.getCurrentPosition(setup, fail)
        } else{
            $('current').innerHTML="Your browser doesn\'t support the Geolocation API. Found at "+secondsSinceFetch+"ms"
        }
    } catch(e){
        console.error(e)
        clearInterval(fetchingFeedback)
        $('current').innerHTML="Errored at "+secondsSinceFetch+"s"
    }
}
let detailed;
let forecast;
function setup(position){
    localStorage.setItem('visitedBefore',"true")
    console.log('Received permission at '+secondsSinceFetch+'s')
    let latitude = position.coords.latitude.toFixed(4)
    let longitude = position.coords.longitude.toFixed(4)
    localStorage.setItem('latitude', latitude)
    localStorage.setItem('longitude', longitude)
    let url;
    //let url=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain,showers,snowfall,precipitation&temperature_unit=fahrenheit&precipitation_unit=inch`
    console.log('Fetching at '+secondsSinceFetch+'s')
    request=fetch(`https://api.weather.gov/points/${latitude},${longitude}`).then(data=>data.json()).then(data=>{
        url=data.properties.forecastHourly
        forecast=data.properties.forecast
    }).then(()=>fetch(forecast).then(data=>data.json()).then(data=>{
        detailed=data.properties.periods[0].detailedForecast;
    })).then(()=>fetch(url).then(data=>data.json()).then(data=>{
        console.log('Received data at '+secondsSinceFetch+'s')
        secondsSinceFetch=0;
        clearInterval(fetchingFeedback)
        console.log(data.properties.periods)
        setUI(data.properties.periods)
    }))
}
function fail(error){
    console.error(error)
}
function setUI(periods){
    $('date').innerHTML=`It is currently`
    console.log(periods[0])
    $('current').innerHTML=`${periods[0].temperature}° ${periods[0].temperatureUnit} and ${periods[0].shortForecast}`
    let sunSet;
    for (let i=0;i<periods.length;i++){
        if (periods[i].isDaytime==false){
            sunSet=periods[i].startTime;
            $('detailed').innerHTML=`<ul><li>${detailed}</li><br><li>Wind Speed: ${periods[0].windSpeed} ${periods[0].windDirection}</li><br><li>Sun set at about ${sunSet.split('T')[1].split('-')[0]}</li></ul>`
            if (i==0){
                makeItDark()
            }
            return;
        }
    }
}

if (localStorage.getItem('visitedBefore')=="true"){
    getLocation()
} else{
    $('date').innerHTML="Your browser requires user input before we can load.<br>Click the button below"
}

function makeItSunny(){
    document.querySelector('thesun').classList.remove('themoon')
    document.querySelector('grass').classList.remove('themoon')
    document.querySelector('hill').classList.remove('themoon')
    document.querySelector('grass').classList.remove('rainy')
    document.querySelector('hill').classList.remove('rainy')
    document.querySelector('sunny').animate({
        opacity: 1
    }, {duration: 750, easing: 'ease', fill: 'forwards'})
    $('.rain.front-row').innerHTML=""
    $('.rain.back-row').innerHTML=""
}

function makeItDark(){
    document.querySelector('thesun').classList.add('themoon')
    document.querySelector('grass').classList.add('themoon')
    document.querySelector('hill').classList.add('themoon')
    document.querySelector('sunny').animate({
        opacity: 0
    }, {duration: 750, easing: 'ease', fill: 'forwards'})
}

function makeItRain() {
    document.querySelector('sunny').animate({
        opacity: 0
    }, {duration: 750, easing: 'ease', fill: 'forwards'})
    document.querySelector('thesun').classList.add('themoon')
    document.querySelector('grass').classList.add('rainy')
    document.querySelector('hill').classList.add('rainy')
    document.querySelector('.mailto').classList.add('rainy')
    document.querySelector('.weathergov').classList.add('rainy')
    //clear out everything
    $('.rain').innerHTML="";
    
    var increment = 0;

    var drops=""
    var backDrops=""

    while (increment < 100) {
        //couple random numbers to use for various randomizations
        //random number between 98 and 1
        var randoHundo = (Math.floor(Math.random() * (98) + 1));
        //random number between 5 and 2
        var randoFiver = (Math.floor(Math.random() * (4) + 2));
        //increment
        increment += randoFiver;
        //add in a new raindrop with various randomizations to certain CSS properties
        drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
    }
    
    $('.rain.front-row').innerHTML+=drops;
    $('.rain.back-row').innerHTML+=backDrops;
};