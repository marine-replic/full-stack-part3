const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

// json-parser middleware /!\ needs to be one of the first middleware logged
app.use(express.json())

// Error logging middleware
app.use(requestLogger)

// // Morgan middleware for logging
// const morgan = require('morgan')
// app.use(morgan('tiny'))

// CORS middleware
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
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Info page about phonebook
app.get('/api/info', (request, response) => {
    Person.find({}).count().then(total => {
        const date = new Date()
        response.send(`<p>Phonebook has info for ${total} people</p><p>${date}</p>`)
    })
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
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

// Updating entry from phonebook
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

// Handler of requests with unknown endpoint
// Must be placed 2nd to last or else every route will return 404
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Handler of requests with result to errors
// Must be placed last
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)