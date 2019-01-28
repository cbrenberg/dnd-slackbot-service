'use strict';

//require node modules
const axios = require('axios');
require('dotenv').config();

//require modules
const service = require('../server/service');

const server = service.listen(process.env.PORT, () => {
  console.log(`dnd-slackbot-service is listening on port ${process.env.PORT} in ${service.get('env')} mode`);

  //announce service to host application's service registry
  const announce = () => axios.put(`${process.env.HOST_BASE_URL}/service/spell/${server.address().port}`)
    .then(response => {
      console.log(response.data);
    })
    .catch(err => console.log('There was an error connecting to service host', err))

  announce();
  //re-announce every 15 seconds
  setInterval(announce, 15 * 1000);
});