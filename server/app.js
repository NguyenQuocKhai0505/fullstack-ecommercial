const bodyParser = require("body-parser");
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv/config")
const authRoutes = require("./routes/auth")
const allowedOrigins = [
  "https://fullstack-ecommerical-gvu6-h4hnn39iq-nguyen-quoc-khais-projects.vercel.app", // admin cũ
  "https://fullstack-ecommerical-gvu6.vercel.app", // admin mới
  "https://fullstack-ecommerical-ch2fdcd9-nguyen-quoc-khais-projects.vercel.app", // client
  "https://fullstack-ecommerical-gvu6.vercel.app" // client/admin (nếu dùng chung)
];

app.use(cors({
  origin: function(origin, callback){
    // Cho phép request không có origin (như từ Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
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

