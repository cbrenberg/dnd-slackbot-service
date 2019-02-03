'use strict';

//require node modules
const axios = require('axios');
require('dotenv').config();

//require modules
const service = require('../server/service');

service.listen(process.env.PORT, () => {
  console.log(`dnd-slackbot-service is listening on port ${process.env.PORT} in ${service.get('env')} mode`);

  //announce service to host application's service registry
  const address = encodeURIComponent(process.env.SELF_URL);
  const announce = () => axios.put(`${process.env.HOST_BASE_URL}/service/spell/${address}`)
    .then(response => {
      console.log(`announced service to ${process.env.HOST_BASE_URL}/service/spell/${address}`);
      console.log("Connected to service host", response.data);
    })
    .catch(err => console.log('Error connecting to service host'))

  announce();
  //re-announce every 60 seconds
  setInterval(announce, 60 * 1000);
});