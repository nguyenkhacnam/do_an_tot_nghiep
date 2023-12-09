const express = require("express");
const cors = require("cors");
require("dotenv").config();

//Config
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//test connection
app.get("/", (req, res) => {
  res.send("Hello this is comebuy-server");
});

//config route
require("./routes/account.routes")(app);
require("./routes/authentication.routes")(app);
require("./routes/product.routes")(app);
require("./routes/productImage.routes")(app);
require("./routes/feature.routes")(app);
require("./routes/notification.routes")(app);
require("./routes/cart.routes")(app);
require("./routes/comment.routes")(app);
require("./routes/branch.routes")(app);
require("./routes/invoice.routes")(app);
require("./routes/email.routes")(app);
require("./routes/cloudinary.routes")(app);
require("./routes/stock.routes")(app);
require("./routes/patronDiscount.routes")(app);
require("./routes/favorite.routes")(app);
require("./routes/banner.routes")(app);
require("./routes/log.routes")(app);
require("./routes/chatbox.routes")(app);

module.exports = app;
