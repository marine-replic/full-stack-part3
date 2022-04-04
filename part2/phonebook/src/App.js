import { useState, useEffect } from 'react'
import Persons from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/persons'



const App = () => {
  const [persons, setPersons] = useState([]) 

  // Fetching person data from server
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])
  
  // State variables for user input
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  // Functions that handle user typing in form fields
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setNewSearch(event.target.value)

  // State variable for error messages
  const [notification, setNotification] = useState({message: null, status: null})

  // Filter function - !newSearch will return true if newSearch is empty and false otherwise
  const filtered = !newSearch
  ? persons
  : persons.filter((person) =>
      person.name.toLowerCase().includes(newSearch.toLowerCase())
    );

  // Adding / Updating someone in the phone book
  const addPerson = (event) => {
    event.preventDefault()

    // Reset form to empty values
    setNewName('')
    setNewNumber('')

    // Create new person for addition or update
    const personObject = { name: newName, number: newNumber }

    //Checking if name is already listed - if yes, alert user
    if(persons.find( ({ name }) => name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        // If update request confirmed, update number
        const id = persons.find(person => person.name === newName).id
        personService
         .update(id, personObject)
         .then (returnedPerson => {
            popUpNotification({message: `Updated ${newName}`, status: 'success'})
           setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
         }
         )
      return
      }
      // If update request cancelled, escape without changes
      else {
        return
      }
    }

    // Add new person to phonebook
    personService
      .create(personObject)
      .then (returnedPerson => {
        popUpNotification({message: `Added ${newName}`, status: 'success'})
        setPersons(persons.concat(returnedPerson))
      })
  }
  
  // Delete name from phonebook
  const handleDeleteRequest = (event) => {
    const id = Number(event.target.id)
    const name = persons.find(person => person.id === id).name
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          popUpNotification({message: `Removed ${name}`, status: 'success'})
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(() => {
          popUpNotification({message: `${name} was already removed from the server`, status: 'error'})
          personService
          .getAll()
          .then(initialPersons => {
            setPersons(initialPersons)
          })
        })
    }
  } 

 // Successful notification appears then disappear
  const popUpNotification = ({ message, status }) => {
    setNotification(
      {message, status}
    )
    setTimeout(() => {
      setNotification({message: null, status: null})
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} status={notification.status}  />
      <Filter newSearch ={newSearch} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <div>
        <Persons persons={filtered} handleDeleteRequest={handleDeleteRequest} />
      </div>
    </div>
  )
}

export default App
