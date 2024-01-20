const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('need password or password and new entry')
    process.exit(1)
}

const password = process.argv[2]

if (process.argv.length < 5) {
    const name = process.argv[3]
    const phoneNum = process.argv[4]
} else {
    const name = null
    const phoneNum = null
}

const url =
    `mongodb+srv://ayra:${password}@cluster0.jdg1kqz.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = (name, number) => {
    const person = new Person({
        name: `${name}`,
        number: `${number}$`,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    // console.log(`phonebook:`)
    Person.find({}).then(result => {
        console.log(`phonebook:`)
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}
else if (process.argv.length === 5) {
    // expect correct input here for now
    addPerson(process.argv[3], process.argv[4])
}