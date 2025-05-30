const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'test',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('user creation fails if username is less than 3 characters', async () => {
    const badUser = {
      username: 'aa',
      name: 'test',
      password: 'password'
    }

    const response = await api
      .post('/api/users')
      .send(badUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'User validation failed: username: Path `username` (`aa`) is shorter than the minimum allowed length (3).')
  })

  test('user creation fails if password is less than 3 characters', async () => {
    const badUser = {
      username: 'test',
      name: 'test',
      password: 'aa'
    }

    const response = await api
      .post('/api/users')
      .send(badUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'password must be set and be atleast 3 characters')
  })
})

after(async () => {
  await mongoose.connection.close()
})
