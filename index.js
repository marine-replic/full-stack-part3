require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

app.use(express.json())

// Morgan middleware for logging
const morgan = require('morgan')
app.use(morgan('tiny'))

// CORS middleware
const cors = require('cors')
app.use(cors())

// Middleware to display static content from the build folder
app.use(express.static('build'))


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Get info for all entries
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Get info for one entry in the phonebook, error if entry not found
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Info page about phonebook
app.get('/api/info', (request, response) => {
    const total = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${total} people</p><p>${date}</p>`)
})

// Adding entry to phonebook
app.post('/api/persons', (request, response) => {
    const body = request.body

    // Generate error if name or number is missing
    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    } 

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    } 

    // // Verify if name already exists in the phonebook
    // const duplicateName = persons.map(p => p.name).includes(body.name)
    // if (duplicateName) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    // Adding new person to MongoDB
    const person = new Person({
        name: body.name,
        number: body.number,
      })
    
      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
})

// Deleting entry from phonebook
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})




const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)