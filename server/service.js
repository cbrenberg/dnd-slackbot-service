'use strict'

const express = require('express');
const service = express();
const axios = require('axios');
const { request, GraphQLClient } = require('graphql-request');

const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT);

//initialize in-memory cache variable of all spell indices and names on startup
let spellListCache;

//graphQL request for cache
client.request(`{ spells 
                  {
                    index
                    name
                  }
                }`)
  .then(res => {
    // console.log('back with spells for cache:', res);
    spellListCache = res;
  })
  .catch(err => console.log('error setting cached spell list:', err));

//handle spell requests from host app
service.get('/service/spell/:spellName', async (req, res, next) => {

  const spellName = req.params.spellName;
  let spellMatch;
  //find matching spell from cache by name
  try {
    spellMatch = spellListCache.spells.filter(spell => spell.name.includes(spellName));
  } catch (err) {
    console.log('Error retrieving spell from cache', err);
  }

  //request spell details from graphQL server by spell index
  client.request(`{
  spell (index: ${spellMatch[0].index}) {
      name
      description
    }
  }`)
    .then(response => {
      //send spell description back to host app
      let stringResponse = response.spell.description;
      res.status(200).send(stringResponse);
    })
    .catch(err => {
      console.log('graphQL request error:', err);
      res.sendStatus(500);
    });

  // **EXAMPLE SPELL DETAIL RESPONSE**

  //{ spell:
  //   {
  //     name: 'Mage Hand',
  //       description:
  //     'A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.'
  //   }
  // }

});


module.exports = service;