const Header = ({ name }) => <h1>{name}</h1>

const Part = ({name, exercises}) => (
  <p>
    {name} {exercises}
  </p>
)

const Total = ({ parts }) => {
  const total = parts.reduce((x, p) => {
    return x+p.exercises
  }, 0)
  return <p><b>Total of {total} exercises</b></p>
}

const Content = ({ parts }) => (
  <div>
    {parts.map(part =>
      <Part key={part.id} name={part.name} exercises={part.exercises} />
    )}
    <Total parts={parts} />
  </div>
)

const Course = ({ name, parts }) => (
  <div>
    <Header name={name} />
    <Content parts={parts} />
  </div>
)

export default Course