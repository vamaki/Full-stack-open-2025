const Persons = ({personsFiltered, deletePerson}) => {
  return (
    personsFiltered.map((person =>
      <p key={person.name}>
        {person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button>
      </p>))
  )
}

export default Persons