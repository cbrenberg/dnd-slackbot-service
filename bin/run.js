'use strict';

//require node modules
const axios = require('axios');
require('dotenv').config();

//require modules
const service = require('../server/service');

const server = service.listen(process.env.PORT, () => {
  console.log(`IRIS-dnd-spells is listening on port ${process.env.PORT} in ${service.get('env')} mode`);

  //announce itself to host application's service registry
  const announce = () => axios.put(`http://localhost:3000/service/spell/${server.address().port}`)
    .then(response => {
      console.log(response.data);
    })
    .catch(err => console.log('There was an error connecting to Iris', err))

  announce();
  //re-announce every 15 seconds
  setInterval(announce, 15 * 1000);
});