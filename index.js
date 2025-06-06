const app = require('./app/app.js');
const PORT = 3000;


app.listen(PORT, ()=>{
    console.log(`servidor escuchando en el puerto ${PORT}`);
})