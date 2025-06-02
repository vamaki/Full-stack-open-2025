import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders content', () => {
  const account = {
    username: 'test account',
    name: 'test account',
    id: '0'
  }
  const blog = {
    title: 'test 1',
    author: 'author 1',
    url: 'test1.com',
    likes: 0,
    user: account
  }

  const { container } = render(<Blog blog={blog} user={account} />)
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('test 1')
  expect(div).toHaveTextContent('author 1')
  expect(div).not.toHaveTextContent('test1.com')
  expect(div).not.toHaveTextContent('likes')
})

test('renders more content after button is pressed', async () => {
  const account = {
    username: 'test account',
    name: 'test account',
    id: '0'
  }
  const blog = {
    title: 'test 2',
    author: 'author 2',
    url: 'test2.com',
    likes: 10,
    user: account
  }

  const { container } = render(<Blog blog={blog} user={account} />)
  const div = container.querySelector('.blog')
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  expect(div).toHaveTextContent('test 2')
  expect(div).toHaveTextContent('author 2')
  expect(div).toHaveTextContent('test2.com')
  expect(div).toHaveTextContent('likes 10')
})

test('clicking like button twice works', async () => {
  const account = {
    username: 'test account',
    name: 'test account',
    id: '0'
  }
  const blog = {
    title: 'test 2',
    author: 'author 2',
    url: 'test2.com',
    likes: 10,
    user: account
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={account} likeBlog={mockHandler}/>)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

})
