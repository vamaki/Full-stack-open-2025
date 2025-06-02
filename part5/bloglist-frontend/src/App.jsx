import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogFrom from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => a.likes < b.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage({ msg: 'Login succesfull', type: 'success' })
      setTimeout(() => {setErrorMessage(null)}, 5000)
    } catch (exception) {
      setErrorMessage({ msg: 'wrong username or password', type: 'err' })
      setTimeout(() => {setErrorMessage(null)}, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setErrorMessage({ msg: 'Logout succesfull', type: 'success' })
    setTimeout(() => {setErrorMessage(null)}, 5000)
  }

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.createBlog(blogObject)
      setBlogs(blogs.concat(createdBlog))
      setErrorMessage({ msg: `a new blog ${blogObject.title} by ${blogObject.author} added`, type: 'success' })
      setTimeout(() => {setErrorMessage(null)}, 5000)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      setErrorMessage({ msg: exception.response.data.error, type: 'err' })
      setTimeout(() => {setErrorMessage(null)}, 5000)
    }
  }

  const likeBlog = async (blogObject) => {
    const likedBlog = { ...blogObject, likes: (blogObject.likes+1) }

    try {
      await blogService.likeBlog(likedBlog)
      setBlogs(blogs.map(blog => blog.id === likedBlog.id ? likedBlog : blog).sort((a, b) => a.likes < b.likes))
    } catch (exception) {
      setErrorMessage({ msg: exception.response.data.error, type: 'err' })
      setTimeout(() => {setErrorMessage(null)}, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      if(confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
        await blogService.deleteBlog(blogObject.id)
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
      }
    } catch (exception) {
      setErrorMessage({ msg: exception.response.data.error, type: 'err' })
      setTimeout(() => {setErrorMessage(null)}, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  if (user === null ) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={errorMessage} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      {user.name} logged in <button onClick={handleLogout}>logout</button>
      <br/>
      <br/>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogFrom createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} user={user}/>
      )}
    </div>
  )
}

export default App