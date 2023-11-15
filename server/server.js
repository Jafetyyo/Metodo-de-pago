const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const mercadopago = require('mercadopago');

// Configurar con tus credenciales
mercadopago.configure({
  access_token: 'TEST-6000157832369770-111420-c615555d2c2317ccb3bcb416fd7e8243-311653061'
});
  
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

app.use(express.static(path.join(__dirname, "/client")));
app.use(cors());

app.get("/", function (req, res) {
  const filePath = path.resolve(__dirname, "..", "client", "Compra.html");
  es.sendFile(filePath);
});

app.post("/create_preference", (req, res) => {
  let preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      },
    ],
    back_urls: {
      success: "http://127.0.0.1:5501/",
      failure: "http://127.0.0.1:5501/",
      pending: "",
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

app.listen(8081, () => {
  console.log("The server is now running on Port 8081");
});
