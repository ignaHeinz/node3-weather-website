const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.port || 3000
//Define paths for Express config
const publicDir = path.join(__dirname, '../public')
const viewsDir = path.join(__dirname, '../templates/views')
const partialDir = path.join(__dirname, '../templates/partials')

//Aca digo que voy a usar view engine con la extension de hbs en los archivos
//view engine tells Express which extension to associate with the template when you call res.render().
//Setup handlebars engine and views location
app.set('view engine', 'hbs')
//Aca seteo el directorio de views para que lo encuentre porque el por default no andaba
app.set('views', viewsDir)
//Registramos donde van a estar las partials
hbs.registerPartials(partialDir)

//Recursos estaticos
//Setup static directory to serve
app.use(express.static(publicDir))
//Aca estoy diciendo que renderice index como pagina principal ''
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Ignacio Heinzmann'
    })
})
app.get('/weather', (req, res) => {
    if(!req.query.address){
        res.send({error: 'You must provide an address'})
    }else{
        geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
            if(!error){
                forecast(longitude, latitude, (error, data) => {
                    if(!error){
                        res.send({
                            forecast: data,
                            location,
                            address: req.query.address
                        })
                    }else{
                        res.send({error})
                    }
                })
            }else{
                res.send({error})
            }
        })
    }
})
//Aca estoy diciendo que renderice about como pagina principal '/about'
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Ignacio Heinzmann'
    })
})
//Aca estoy diciendo que renderice help como pagina principal '/help'
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Ignacio Heinzmann'
    })
})
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ignacio Heinzmann',
        message: 'Help Article not found !'
    })
})
// * como URL significa todas las demas URL que no han sido listadas arriba. Necesita estar al ultimo
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ignacio Heinzmann',
        message: 'Page not found !'
    })
})
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})