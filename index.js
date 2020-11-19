const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require('./routes/admin/auth')
const productsRouter = require('./routes/admin/products')

const app = express();

//Allow express access to public folder
app.use(express.static('public'))
//Globally apply bodyParser
//extended: true - allow object to use any type of value
app.use(bodyParser.urlencoded({ extended: true }));

//Apply cookieSession
app.use(cookieSession({ keys: ["dfiaodjiafodskl323mk3l23"] }));

//Apply authRouter
app.use(authRouter)
app.use(productsRouter)

//Listen on Port 3000
app.listen(3000, () => {
  console.log("listening on Port 3000");
});
