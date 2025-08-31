const bodyParser = require("body-parser");
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv/config")
const authRoutes = require("./routes/auth")
app.use(cors())
app.options("*",cors())

//Middleware 
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files
// app.use(express.static(__dirname));

//Route
const categoryRoutes = require("./routes/categories")
console.log("Category routes:", categoryRoutes.stack ? "Loaded" : "Not loaded");
const productRoutes = require("./routes/products")
const subcatRoutes = require("./routes/subcat")

app.use("/api/category",categoryRoutes)
app.use("/api/products",productRoutes)
app.use("/api/subcat",subcatRoutes)
app.use("/api/auth",authRoutes)
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

