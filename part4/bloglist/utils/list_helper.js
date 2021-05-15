const _ = require("lodash");

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favouriteBlog = (blogs) => {
  const blog = blogs.reduce(
    (acc, curr) => (curr.likes > acc.likes ? curr : acc),
    {
      title: "",
      author: "",
      likes: 0,
    }
  );
  const picked = (({ title, author, likes }) => ({ title, author, likes }))(
    blog
  );

  return picked;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 0;

  const authorArray = _.map(blogs, "author");
  const mostCommonAuthor = _.chain(authorArray)
    .countBy()
    .toPairs()
    .max(_.last)
    .head()
    .value();

  const mostCommonCount = _.chain(authorArray)
    .countBy()
    .toPairs()
    .max(_.last)
    .value()[1];

  return { author: mostCommonAuthor, blogs: mostCommonCount };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return 0;

  const authors = {};
  blogs.forEach(
    (blog) =>
      (authors[blog.author] = authors[blog.author]
        ? authors[blog.author] + blog.likes
        : blog.likes)
  );

  const mostPopular = { author: "", likes: 0 };
  for (const author in authors) {
    if (authors[author] > mostPopular.likes) {
      mostPopular.author = author;
      mostPopular.likes = authors[author];
    }
  }

  return mostPopular;
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
