const bodyParser = require("body-parser");
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv/config")
const authRoutes = require("./routes/auth")
const allowedOrigins = [
  //Local
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:4000",
  // Client
  "https://fullstack-ecommercial.vercel.app",
  // Admin
  "https://fullstack-ecommercial-gvu6.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    console.log("[CORS DEBUG] Request from origin:", origin);
    if(!origin) {
      console.log("[CORS DEBUG] No origin (maybe Postman or server-to-server)");
      return callback(null, true);
    }
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = '[CORS DEBUG] The CORS policy for this site does not allow access from the specified Origin: ' + origin;
      console.error(msg);
      return callback(new Error(msg), false);
    }
    console.log("[CORS DEBUG] Origin allowed:", origin);
    return callback(null, true);
  },
  credentials: true
}));
app.options("*", cors());

//Middleware 
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files
// app.use(express.static(__dirname));

//Route
const categoryRoutes = require("./routes/categories")
const productRoutes = require("./routes/products")
const subcatRoutes = require("./routes/subcat")

app.use((req, res, next) => {
  console.log(`[ROUTE DEBUG] ${req.method} ${req.originalUrl}`);
  next();
});

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

