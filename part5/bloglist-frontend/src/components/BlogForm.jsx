import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <form onSubmit={addBlog}>
      <div>
        title: <input data-testid='title' value={title} onChange={event => setTitle(event.target.value)}/>
      </div>
      <div>
        author: <input data-testid='author' value={author} onChange={event => setAuthor(event.target.value)}/>
      </div>
      <div>
        url: <input data-testid='url' value={url} onChange={event => setUrl(event.target.value)}/>
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
