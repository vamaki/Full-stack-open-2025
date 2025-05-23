import { useEffect, useState } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName && person.number !== newNumber)) {
      const person = persons.find(person => person.name === newName)
      if (!confirm(`${person.name} is already added to phonebook, replace old number with a new one?`)) {
        return
      }
      personService
        .update(person.id, {name: newName, number: newNumber}).then(response => {
          setPersons(persons.map(person => person.id !== response.data.id ? person : response.data))
          setErrorMessage({msg:`Updated the number of ${newName}`, type:"success"})
          setTimeout(() => setErrorMessage(null), 5000)
        })
        .catch(error => {
          console.log(error)
          setErrorMessage({msg:`Information of ${newName} has already been removed from server`, type:"err"})
          setTimeout(() => setErrorMessage(null), 5000)
        })
        setNewName('')
        setNewNumber('')
    }
    else if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      // setPersons(persons.concat({name: newName, number: newNumber}))
      personService
        .create({name: newName, number: newNumber})
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
      setErrorMessage({msg:`Added ${newName}`, type:"success"})
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleFilterChange = (event) => (
    setFilter(event.target.value)
  )

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (!confirm(`Delete ${person.name} from phonebook?`)) {
      return
    }

    personService
      .deletePerson(id).then()

    setPersons(persons.filter(person => person.id !== id))
  }

  const personsFiltered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons personsFiltered={personsFiltered} deletePerson={deletePerson}/>
    </div>
  )
}

export default App