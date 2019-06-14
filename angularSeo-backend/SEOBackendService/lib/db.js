// ./lib/db.js
const mongoose = require('mongoose')

var options = {
  user: "mongo-root",
  pass: "password",
  useNewUrlParser: true
};


mongoose.Promise = global.Promise;
// Usamos el método connect para conectarnos a nuestra base de datos
mongoose.connect("mongodb://ec2-34-230-43-254.compute-1.amazonaws.com:27017/admin?authSource=admin", options)
    .then(() => {
        // Cuando se realiza la conexión, lanzamos este mensaje por consola
        console.log("La conexión a la base de datos se ha realizado correctamente")
    
        // CREAR EL SERVIDOR WEB CON NODEJS
        
		//app.listen(port, () => {
          //  console.log("servidor corriendo en http://localhost:3800");
		//});
    })
    // Si no se conecta correctamente escupimos el error
    .catch(err => console.log(err));