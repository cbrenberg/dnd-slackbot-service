'use strict'

const express = require('express');
const service = express();
const axios = require('axios');
const { request, GraphQLClient } = require('graphql-request');

const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT);

const spellListCache = async () => {
  await client.request(`
{
  spells {
    index
    name
  }
}
`)
    .then(res => {
      console.log(res);
      return res;
    })
    .catch(err => console.log(err));
};

//http://dataservice.accuweather.com/locations/v1/cities/search?apiKey=${process.env.ACCUWEATHER_API_KEY}q=${req.query.location}
service.get('/service/spell/:spellName', async (req, res, next) => {

  console.log(spellListCache.spells);
  const spellName = req.params.spellName;
  console.log('incoming spell name:', spellName);

  const spellMatch = spellListCache.spells.filter(spell => spell.name.includes(spellName));
  console.log('Found matching spell name!', spellMatch)

  client.request(`{
  spell (index: ${spellMatch[0].index}) {
      name
      description
    }
  }`)
    .then(data => console.log('spell details:', data))
    .catch(err => console.log(err));
  // try {
  //   let locationResponse = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.ACCUWEATHER_API_KEY}&q=${req.query.lat},${req.query.lng}`);
  //   console.log("location response data:", locationResponse.data);
  //   const locationCode = locationResponse && locationResponse.data && locationResponse.data.Key ? locationResponse.data.Key : null;
  //   console.log("location Code:", locationCode);
  //   let weatherResponse = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${locationCode}?apikey=${process.env.ACCUWEATHER_API_KEY}`);
  //   console.log("weather response data:", weatherResponse.data);
  //   const localWeatherString = `${weatherResponse.data[0].WeatherText} and ${weatherResponse.data[0].Temperature.Imperial.Value} degrees`;
  //   console.log("local weather string response:", localWeatherString);
  //   res.send(localWeatherString.toLowerCase());
  // } catch (error) {
  //   console.log(error.data);
  //   res.status(500).send(error.data);
  // }

});


module.exports = service;