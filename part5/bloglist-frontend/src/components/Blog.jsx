import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div style={blogStyle} className='blog'>
      {blog.author} {blog.title} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button><br/>
      {visible &&
        <div>
          {blog.url}<br/>
          likes {blog.likes} <button onClick={() => likeBlog(blog)}>like</button><br/>
          {blog.user.name}<br/>
          {blog.user.username === user.username && <><button onClick={() => deleteBlog(blog)}>remove</button><br/></>}
        </div>
      }
    </div>
  )
}

export default Blog
