const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)

const login = async () => {
  await helper.createUser()
  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
  return response.body.token
}

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('blogs tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(e => e.title)
    assert(titles.includes('Blog 1'))
    assert(true, true)
  })

  test('blogs use id and not _id', async () => {
    const blogs = await helper.blogsInDb()
    blogs.forEach(blog => {
      assert(blog.id, "Blogs have id property")
      assert.strictEqual(typeof blog.id, 'string', 'id is a string')
      assert.strictEqual(blog._id, undefined, "Blogs do not have _id property")
    });
  })

  test('new blog is created correctly', async () => {
    const newBlog = {
      title: 'Blog 3',
      author: 'Author 3',
      url: 'url3.com',
      likes: 3,
    }
    const token = await login()
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201).
      expect('Content-Type', /application\/json/)

    const blogsAfterAdding = await helper.blogsInDb()
    assert.strictEqual(blogsAfterAdding.length, helper.initialBlogs.length + 1)
    const titles = blogsAfterAdding.map(blog => blog.title)
    assert(titles.includes('Blog 3'))

  })

  test('blog with missing likes in request defaults to 0 likes', async () => {
    const newBlog = {
      title: 'Blog 4',
      author: 'Author 4',
      url: 'url4.com'
    }
    const token = await login()

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201).
      expect('Content-Type', /application\/json/)

    const blogsAfterAdding = await helper.blogsInDb()
    const blog = blogsAfterAdding.filter(blog => blog.title === newBlog.title)
    assert.strictEqual(blog[0].likes, 0)
  })

  test('missing title from request returns status 400', async () => {
    const newBlog = {
      author: 'Author 5',
      url: 'url5.com'
    }
    const token = await login()
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('missing url from request returns status 400', async () => {
    const newBlog = {
      title: 'Blog 6',
      author: 'Author 6',
    }
    const token = await login()
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('missing token from request returns status 401', async () => {
    const newBlog = {
      title: 'Blog 6',
      author: 'Author 6',
      url: 'tokentest.com'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('blog can be deleted', async() => {
    const blogs = await helper.blogsInDb()
    const id = blogs[0].id
    const token = await login()
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    await Blog.findOneAndUpdate({author: 'Author 1'}, {user : user})
    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  test('likes can be updated', async () => {
    const blogs = await helper.blogsInDb()
    const blog = blogs[0]
    blog.likes = 10
    await api
      .put(`/api/blogs/${blog.id}`)
      .send(blog)
      .expect(200)

    const response = await api
      .get(`/api/blogs/${blog.id}`)

    assert.strictEqual(response.body.likes, 10)
    assert.notEqual(response.body.likes, 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})
