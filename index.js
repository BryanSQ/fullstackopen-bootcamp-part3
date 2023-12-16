require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(res => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message);
  })


const app = express()
app.use(express.static('dist'))
app.use(express.json())


morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

const format = ':method :url :status :res[content-length] :response-time ms :body'
app.use(morgan(format))

app.use(cors())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

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

// 3.1
app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

// 3.2
app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.find({})
    .then(returnedPeople => {
      const countStat = `Phonebook has info for ${returnedPeople.length} people`
      const info = `<p>${countStat}</p>\
                    <p>${date}</p>`
      res.send(info)
    })
    .catch(error => next(error))
})

//3.3
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  console.log(id);
  Person.findById(id)
    .then(person => {
      if (person){
        res.json(person)
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// 3.4 | 3.15
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


// 3.5
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  // 3.6
  if (!body.name || !body.number){
    return res.status(400).json({
      error: "Missing info"
    })
  }
  
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save()
    .then(saved => {
      res.json(saved)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, {new: true})
    .then(updated => {
      res.json(updated)
    })
    .catch(error => next(error))
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`); 
})