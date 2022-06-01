let btn = document.getElementById("btn");
let content= document.getElementById("content");
let checkbox=document.getElementById("checkbox")
let span1=document.getElementById("span1")
let span2=document.getElementById("span2")
let span3=document.getElementById("span3")
let span4=document.getElementById("span4")
let span5=document.getElementById("span5")
let span6=document.getElementById("span6")
let span7=document.getElementById("span7")
let span8=document.getElementById("span8")
let span9=document.getElementById("span9")
let span10=document.getElementById("span10")
let input=document.getElementById("input")
let check=document.getElementById("check")
let asidecontent=document.getElementById("asidecontent")
let switchcheck=document.getElementById("switchcheck")
let label=document.getElementById("label")
let ball=document.getElementById("ball")
let img=document.getElementById("img")

//hide contente intially
content.style.display="none";




//geting data from api
    function getData(){
        let url = `http://api.weatherapi.com/v1/current.json?key=45605ed6b2ea43ee88363631222705&q=${input.value}&aqi=yes`;
        fetch(url).then((respon)=>{
        return respon.json()
    }).then((data)=>{
       const result= JSON.stringify(data)
       displaydata(data);
       const marker1 = new mapboxgl.Marker()
   .setLngLat([data.location.lon,data.location.lat])
   .addTo(map)
   const start=[data.location.lon,data.location.lat]
   const end=[data.location.lon,data.location.lat]
   let isAtstart=true;
   const target=isAtstart?end:start;
   isAtstart=!isAtstart;
   map.flyTo({
       center:target,
       zoom:9,
       bearing:0,
       speed:0.5,
       curve:1,
       essential:true
   })
    })
    }



    //displaying data function
    function displaydata(data){
        let obj={
         name:data.location.name,
         country:data.location.country,
         region:data.location.region,
         tempc:data.current.temp_c,
         weather:data.current.condition.text,
         windk:data.current.wind_kph,
        tempf:data.current.temp_f,
        windm:data.current.wind_mph,
        icon: data.current.condition.icon,
        aqi:data.current.air_quality.pm2_5,
        humidity:data.current.humidity,
        cloud:data.current.cloud,
        UV:data.current.uv
        }
         siunit(obj)
        span1.innerText="City: "+obj.name;
        span2.innerText="Region: "+obj.region;
        span3.innerText="Country: "+obj.country;
        span5.innerText="Weather: "+obj.weather;
        span6.innerText="Cloud: "+obj.cloud+"%";
        span9.innerText="Humidity: "+obj.humidity+"%";
  
    



      //event for changing unit
       checkbox.addEventListener('change',function toggleunit(){
        if(checkbox.checked){
            nonsiunit(obj)
        }
         else{
             siunit(obj)
         }
    })
   img.innerHTML= `<img src="${obj.icon}"/>`
    }
    


//function to show non SI unit
function nonsiunit(obj){
checkbox.checked=true;
span4.innerText="Tempreture: "+obj.tempf+"°f";
span7.innerText="Wind Speed: "+obj.windm+"mph";
span8.innerText="Air Quality: "+obj.aqi
span10.innerText="UV: "+obj.UV
}



//function to show SI unit
function siunit(obj){
    checkbox.checked=false;
    span4.innerText="Tempreture: "+obj.tempc+"°C";
    span7.innerText="Wind Speed: "+obj.windk+"kph";
    if (obj.aqi<=12.0) {
        span8.innerText="Air Quality: Good";
    }
    else if (obj.aqi>=12.1 && obj.aqi<=35.4) {
        span8.innerText="Air Quality: Moderate";
    }
    else if (obj.aqi>=35.5 && obj.aqi<=55.4) {
        span8.innerText="Air Quality: Unhealty for sensitive screen";
    }
    else if (obj.aqi>=55.5 && obj.aqi<=150.4) {
        span8.innerText="Air Quality: Unhealty";
    }
    else if (obj.aqi>=150.5 && obj.aqi<=250.4) {
        span8.innerText="Air Quality: Very Unhealty";
    }
    else if (obj.aqi>=250.5) {
        span8.innerText="Air Quality: Hazardous";
    }
    if(obj.UV<=2){
        span10.innerText="UV: Low"
    }
    else if(obj.UV>2 && obj.UV <=5){
        span10.innerText="UV: Moderate"
    }
    else if(obj.UV>5 && obj.UV <=7){
        span10.innerText="UV: High"
    }
    else if(obj.UV>7 && obj.UV <=10){
        span10.innerText="UV: Very High"
    }
    else if(obj.UV>=11){
        span10.innerText="UV: Extreme"
    }
}





//on click display data on screen
btn.addEventListener('click',()=>{
   getData()
   content.style.display="block"
   input.value="";
   
});




//on hover show message to change unit
checkbox.addEventListener('mouseover',()=>{
    check.style.display="inline-block"
    if(checkbox.checked){
        check.innerText="Check To See given information in SI unit";
    }
    else{
        check.innerText="Check To See given information in non SI unit";
    }
})



//on leave hide message to change unit
checkbox.addEventListener('mouseleave',()=>{
    check.style.display="none"
})



// function for switching mode automatically
function screenmode(){
    let date=new Date();
    let hour=date.getHours();
    if(hour>=7 && hour<=20){
        whitemode()
    } 
    else{
        darkmode()
    }
}
screenmode();



//function for switching mode manually
switchcheck.addEventListener('change',function switchmode(){
    if(switchcheck.checked){
         darkmode()
        }
        else{
           whitemode() 
    }
  })



  // function for night mode
function darkmode(){
    switchcheck.checked=true;
    document.body.style.backgroundColor='#292c35';
    document.body.style.Color='#fff';
    asidecontent.style.color='#fff'; 
    check.style.color='#fff'; 
    label.style.backgroundColor="#fff"
    ball.style.backgroundColor="black"
}



//function for daymode
function whitemode(){
    switchcheck.checked=false;
    document.body.style.backgroundColor='#fff'
    document.body.style.Color='black'
    asidecontent.style.color='black';
    check.style.color='black';
    label.style.backgroundColor="black"
    ball.style.backgroundColor="#fff" 
}
