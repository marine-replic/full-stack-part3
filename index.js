const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Morgan middleware for logging
const morgan = require('morgan')
app.use(morgan('tiny'))

// CORS middleware
const cors = require('cors')
app.use(cors())



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Get info for all entries
app.get('/api/persons', (request, response) => {
    response.json(persons)
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

// Generate random id
const generateId = () => {
    id = Math.floor(Math.random() * 1000000000)
    return id
} 

// Adding entry to phonebook
app.post('/api/persons', (request, response) => {
    const person = request.body

    // Generate error if name or number is missing
    if (!person.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    } 

    if (!person.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    } 

    // Verify if name already exists in the phonebook
    const duplicateName = persons.map(p => p.name).includes(person.name)
    if (duplicateName) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    // Add new person to list of persons
    person.id = generateId()
    persons = persons.concat(person)
    console.log(persons)

    // Post new list
    response.json(persons)
})

// Deleting entry from phonebook
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})




const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)