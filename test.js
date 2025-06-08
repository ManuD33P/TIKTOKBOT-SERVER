
const date = Date.now() 
console.log(date);

setTimeout(()=>{
    console.log(date - Date.now());
},5000)