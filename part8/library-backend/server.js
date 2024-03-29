require("dotenv").config();
const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  gql,
} = require("apollo-server");
const mongoose = require("mongoose");
const { PubSub } = require("apollo-server");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const jwt = require("jsonwebtoken");

const pubsub = new PubSub();
const JWT_SECRET = "secretkey";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({});
      }

      // if (args.author && !args.genre)
      //   return books.filter((b) => b.author === args.author);
      if (args.genre && !args.author)
        return Book.find({ genres: { $in: [args.genre] } });
      // else
      //   return books.filter(
      //     (b) => b.genres.includes(args.genre) && b.author === args.author
      //   );
    },
    allAuthors: () => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      let author = await Author.findOne({ name: args.author });

      try {
        if (!author) {
          author = new Author({ name: args.author, bookCount: 1 });
        } else {
          author.bookCount += 1;
        }
        await author.save();

        const book = new Book({ ...args, author: author._id });

        pubsub.publish("BOOK_ADDED", { bookAdded: book });

        return book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      try {
        const author = await Author.findOne({ name: args.name });
        author.born = args.setBornTo;
        return author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    createUser: (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
  // Author: {
  //   bookCount: async (root) => {
  //     let author;
  //     if (!root._id) {
  //       console.log("no root id");
  //       author = await Author.findOne({ name: root.name });
  //     }

  //     console.log("book count");
  //     const books = author
  //       ? await Book.find({ author: { $in: [author._id] } })
  //       : await Book.find({ author: { $in: [root._id] } });
  //     return books.length;
  //   },
  // },
  Book: {
    author: async (root) => {
      const author = await Author.findById(root.author);
      return {
        name: author.name,
        born: author.born,
        bookCount: author.bookCount,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
