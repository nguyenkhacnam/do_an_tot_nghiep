const axios = require("axios");
const SendBroadCast = (data) => {
  axios
    .post(process.env.WEBSOCKET_DEPLOYED, data.body)
    .then((response) => {
      // console.log(response)
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = SendBroadCast;
