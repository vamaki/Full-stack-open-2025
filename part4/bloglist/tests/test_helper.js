const Blog = require("../models/blog")
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author 1',
    url: 'url1.com',
    likes: 1,
  },
  {
    title: 'Blog 2',
    author: 'Author 2',
    url: 'url2.com',
    likes: 2,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const createUser = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  createUser
}