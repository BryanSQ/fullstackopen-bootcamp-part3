const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

const format = ':method :url :status :res[content-length] :response-time ms :body'
app.use(morgan(format))

app.use(cors())

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
  res.json(persons)
})

// 3.2
app.get('/info', (req, res) => {
  const people = `Phonebook has info for ${persons.length} people`
  const date = new Date()
  const info = `<p>${people}</p>\
                <p>${date}</p>`
  res.send(info)
})

//3.3
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  const person = persons.find(person => person.id === id)

  if (person){
    res.json(person)
  }
  else{
    res.status(404).end()
  }

})

// 3.4
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random()* 10000)
}

// 3.5
app.post('/api/persons', (req, res) => {
  const body = req.body

  // 3.6
  if (!body.name || !body.number){
    return res.status(400).json({
      error: "Missing info"
    })
  }

  const exists = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())

  if (exists){
    return res.status(400).json(
      {
        error: "Name must be unique"
      }
    )
  }

  const newPerson = {
    ...body,
    id: generateId()
  }

  persons = persons.concat(newPerson)

  res.json(newPerson)
})


const PORT = 3001

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`); 
})