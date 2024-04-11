
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
        $('current').innerHTML="Fetching (0ms elapsed)"
        fetchingFeedback = setInterval(() => {
            secondsSinceFetch+=10;
            $('current').innerHTML=`Fetching... (${secondsSinceFetch}ms elapsed)`
        }, 2);
        if (navigator.geolocation){
            console.log('Requesting Geolocation API at '+secondsSinceFetch+'ms')
            navigator.geolocation.getCurrentPosition(setup, fail)
        } else{
            $('current').innerHTML="Your browser doesn\'t support the Geolocation API. Found at "+secondsSinceFetch+"ms"
        }
    } catch(e){
        console.error(e)
        clearInterval(fetchingFeedback)
        $('current').innerHTML="Errored at "+secondsSinceFetch+"ms"
    }
}
let name;
let detailed;
function setup(position){
    console.log('Received permission at '+secondsSinceFetch+'ms')
    let latitude = position.coords.latitude.toFixed(4)
    let longitude = position.coords.longitude.toFixed(4)
    let url;
    //let url=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain,showers,snowfall,precipitation&temperature_unit=fahrenheit&precipitation_unit=inch`
    console.log('Fetching at '+secondsSinceFetch+'ms')
    fetch(`https://api.weather.gov/points/${latitude},${longitude}`).then(data=>data.json()).then(data=>{
        url=data.properties.forecastHourly
        fetch(data.properties.forecast).then(data=>data.json()).then(data=>{
            name=data.properties.periods[0].name;
            detailed=data.properties.periods[0].detailedForecast;
        })
    }).then(()=>fetch(url).then(data=>data.json()).then(data=>{
        console.log('Received data at '+secondsSinceFetch+'ms')
        secondsSinceFetch=0;
        clearInterval(fetchingFeedback)
        console.log(data.properties.periods)
        setUI(data.properties.periods[0])
    }))
}
function fail(error){
    console.error(error)
}
function setUI(periods){
    $('date').innerHTML=`${name} will be`
    $('current').innerHTML=`${periods.temperature}° ${periods.temperatureUnit}`
    $('detailed').innerHTML=`${detailed}`
    
    //setting stuff like the sun
    if (name=="Tonight"){
        document.querySelector('thesun').classList.add('themoon')
        document.querySelector('grass').classList.add('themoon')
        document.querySelector('hill').classList.add('themoon')
        document.querySelector('sunny').animate({
            opacity: 0
        }, {duration: 750, easing: 'ease', fill: 'forwards'})
    }
}
getLocation()

function makeItRain() {
    document.querySelector('grass').classList.add('rainy')
    document.querySelector('hill').classList.add('rainy')
    document.querySelector('.mailto').classList.add('rainy')
    document.querySelector('.weathergov').classList.add('rainy')
    //clear out everything
    $('.rain').innerHTML="";
    
    var increment = 0;
    var drops = "";
    var backDrops = "";
    
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
