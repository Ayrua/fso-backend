require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const errorHandler = require('./errorHandler')
const app = express()
const PORT = process.env.PORT

morgan.token('body', function (req, res) {return (req.method === 'POST' ? JSON.stringify(req.body) : ' ')})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))
app.use(errorHandler)

let data = [
  {
    'id': 1,
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': 2,
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': 3,
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': 4,
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]

//console.log(data)

app.get('/', (request, response) => {
  response.send(
    `<h1>Phonebook API</h1>` +
    `<a href='https://render-test-5mlw.onrender.com/api/persons'>phonebook api all</a> <p \>` +
    `<a href='https://render-test-5mlw.onrender.com/info'>for info click me</a>`
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => { next(error) })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const checkDupe = (name) => {
  Person.find({}).then(persons => {
    return persons.find(p => p.name === name)
  })
}

app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      const counter = persons.length
      return counter
    })
    .then((counter) => {
      response.send(
        `Phonebook has info for ${String(counter)} people <p \>${new Date()}`
      )
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  if (checkDupe(body.name)) {
    return response.status(400).json({
      error: 'name already in database'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  data = data.concat(person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

// code for put update number; not in use because number change was different skip for now
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})