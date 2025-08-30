# Blog Backend API

A robust and scalable backend API for a blog application built with NestJS, featuring user authentication, post management, and profile management.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: User registration, login, and profile management
- **Post Management**: Create, read, update, and delete blog posts
- **Image Upload**: Support for post images with file upload handling
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Security**: JWT guards, password encryption, and input validation
- **Testing**: Comprehensive test suite with Jest

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **Authentication**: JWT with Passport.js
- **File Upload**: Multer for handling multipart/form-data
- **Language**: TypeScript
- **Testing**: Jest for unit and e2e testing

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mani62/Blog-Backend.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=4010
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production build
   npm run build
   npm run start:prod
   ```

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Users
- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post (authenticated)
- `PUT /posts/:id` - Update post (authenticated)
- `DELETE /posts/:id` - Delete post (authenticated)

### Profile
- `GET /profile` - Get user profile (authenticated)
- `PUT /profile` - Update user profile (authenticated)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📁 Project Structure

```
src/
├── auth/           # Authentication module
├── user/           # User management
├── posts/          # Post management
├── profile/        # Profile management
├── prisma/         # Database service
└── app.module.ts   # Main application module
```

## 🗄️ Database Schema

### User Model
- `id`: Unique identifier (UUID)
- `email`: User email (unique)
- `password`: Hashed password
- `name`: User's display name
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Post Model
- `id`: Unique identifier (UUID)
- `title`: Post title
- `content`: Post content
- `published`: Publication status
- `authorId`: Reference to author
- `image`: Optional image URL
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## 🚀 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start production server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔧 Configuration

The application can be configured through environment variables:

- `PORT`: Server port (default: 4010)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing

## 📄 License

This project is licensed under the UNLICENSED license.

## 🤝 Support

If you have any questions or need help, please open an issue in the repository.

---

Built with ❤️ using NestJS
