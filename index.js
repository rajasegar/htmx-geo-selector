const fastify = require('fastify');
const fastifyPug = require('fastify-pug');
const fastifyFormbody = require('fastify-formbody');
const axios = require('axios');
const pug = require('pug');
const R = require('ramda');

const PORT = process.env.PORT || 3000;

const app = fastify({logger: true });

app.register(fastifyPug, { 
  views: 'views', 
  filename: (view) => `views/${view}` 
});
app.register(fastifyFormbody);

app.get('/', async (req, res) => {
  res.render('index.pug');
});

app.post('/subregions', async (req, res) => {
  const { region } = req.body;
  console.log('region: ' , region);
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/region/${region}?fields=subregion`);
    const subRegions = R.uniq(response.data.map(r => r.subregion));
    const template = pug.compileFile('views/includes/sub-regions.pug');
    res.send(template({ subRegions }));

  } catch(err)  {
    console.log(err);
    res.send('<h2>No subregions found</h2>');
  }

});

app.post('/countries', async (req, res) => {
  const { subregion } = req.body;
  console.log('subregion: ' , subregion);
  try {
    const response = await axios.get(`https://restcountries.herokuapp.com/api/v1/subregion/${subregion}`);
    const countries = response.data;
    const template = pug.compileFile('views/includes/countries.pug');
    res.send(template({ countries }));

  } catch(err)  {
    console.log(err);
    res.send('<h2>No countries found</h2>');
  }

});

app.post('/country', async (req, res) => {
  const { code } = req.body;
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/alpha/${code}`);
    const country = response.data;
    console.log(country);
    const template = pug.compileFile('views/includes/country.pug');
    res.send(template({ country }));

  } catch(err)  {
    console.log(err);
    res.send('<h2>No country info found</h2>');
  }

});

app.listen(PORT, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

/*
const start = async () => {
  try {
    await app.listen(PORT);
  } catch(err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
*/
