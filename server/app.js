const bodyParser = require("body-parser");
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv/config")

app.use(cors())
app.options("*",cors())

//Middleware 
app.use(bodyParser.json())

//Route
const categoryRoutes = require("./routes/categories")
const productRoutes = require("./routes/products")

app.use("/api/category",categoryRoutes)
app.use("/api/products",productRoutes)

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Database connection is ready...');
    //Server 
    app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})
})
.catch((err) => {
    console.log('Database connection failed:', err);
});

