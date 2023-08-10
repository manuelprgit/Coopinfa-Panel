const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = 3010;

app.set('view engine', 'hbs');
app.set('views', './public/html')

hbs.registerPartials(path.join(__dirname, 'public','html','partials'));
app.use(express.static(path.join(`${__dirname}/public`)));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/articulos', (req, res) => {
    res.render('index');
});

app.get('/categorias', (req, res) => {
    res.render('categorias');
});

app.get('/productos', (req, res) => {
    res.render('productos');
});

app.get('/tags', (req, res) => {
    res.render('tags');
});

app.get('/consejo', (req, res) => {
    res.render('consejo');
});

app.get('/integrantes-consejo', (req, res) => {
    res.render('integrantes-consejo');
});

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})
