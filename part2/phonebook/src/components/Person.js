const Persons = ({ persons, handleDeleteRequest }) =>
  <>
    {persons.map(person =>
      <Person key={person.id} person={person} handleDeleteRequest={handleDeleteRequest} />
    )}
  </>

const Person = ({ person, handleDeleteRequest }) =>
  <>
    <p>
      {person.name} {person.number} <DeleteButton id={person.id} handleDeleteRequest={handleDeleteRequest} />
    </p>
  </>

const DeleteButton = ({ id, handleDeleteRequest }) => {
  // Deleting a name and number from the phone book
  return (
    <button onClick={handleDeleteRequest} id={id} >delete</button>
  )
}

export default Persons