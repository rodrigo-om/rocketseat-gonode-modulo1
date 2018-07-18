const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const MAJOR_AGE = 18;

const ensureNameWasProvided = (req, res, next) => {
  if (req.query.nome === '') {
    return res.redirect('/');
  }
  return next();
};

function isMajor(currentAge) {
  return currentAge > MAJOR_AGE;
}

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/major', ensureNameWasProvided);
app.use('/minor', ensureNameWasProvided);

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  if (isMajor(moment().diff(moment(req.body.data_nasc, 'YYYY/MM/DD'), 'years'))) {
    res.redirect(`/major?nome=${req.body.nome}`);
  } else {
    res.redirect(`/minor?nome=${req.body.nome}}`);
  }
});

app.get('/major', (req, res) => {
  res.render('major', { nome: req.query.nome });
});

app.get('/minor', (req, res) => {
  res.render('minor', { nome: req.query.nome });
});

app.listen(3000);
