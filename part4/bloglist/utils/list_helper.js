const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total+blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((highest, blog) => highest.likes > blog.likes ? highest : blog, 0)
}

const mostBlogs = (blogs) => {
  const blogMap = blogs.reduce((map, blog) => {
    if (map.has(blog.author)) {
      map.set(blog.author, map.get(blog.author)+1)
    } else {
      map.set(blog.author, 1)
    }
    return map
  }, new Map())
  return [...blogMap.entries()].reduce((topAuthor, author) => {
    return topAuthor.blogs > author[1] ? topAuthor : { author: author[0], blogs: author[1] }
  }, { author: '', blogs: 0 })
}

const mostLikes = (blogs) => {
  const blogMap = blogs.reduce((map, blog) => {
    if (map.has(blog.author)) {
      map.set(blog.author, map.get(blog.author)+blog.likes)
    } else {
      map.set(blog.author, blog.likes)
    }
    return map
  }, new Map())
  return [...blogMap.entries()].reduce((topAuthor, author) => {
    return topAuthor.likes > author[1] ? topAuthor : { author: author[0], likes: author[1] }
  }, { author: '', likes: 0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}