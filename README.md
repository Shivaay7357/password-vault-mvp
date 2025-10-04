# Password Generator + Secure Vault MVP

A full-stack password management application built with Next.js, Express.js, and MongoDB. Features client-side encryption, JWT authentication, and a clean, responsive UI.

## Features

### 🔐 Security Features
- **Client-side encryption**: All vault data is encrypted before sending to the server
- **JWT authentication**: Secure user authentication with JSON Web Tokens
- **Password hashing**: User passwords are hashed using bcryptjs
- **Auto-clear clipboard**: Generated passwords auto-clear from clipboard after 15 seconds

### 🎯 Core Functionality
- **Password Generator**: Create strong passwords with customizable options
  - Adjustable length (4-128 characters)
  - Include/exclude uppercase, lowercase, numbers, symbols
  - Exclude similar characters (0, O, 1, l, I)
  - Real-time password strength indicator
- **Secure Vault**: Store and manage passwords
  - Add, edit, delete vault items
  - Search and filter vault items
  - Copy usernames and passwords to clipboard
  - Show/hide password functionality
- **User Authentication**: Register and login system
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** for styling
- **CryptoJS** for client-side encryption
- **Axios** for API calls

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd password-vault-mvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory based on `env.example`:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/password-vault

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NEXTAUTH_URL=http://localhost:3000

# Client-side encryption key (should be different from JWT_SECRET)
ENCRYPTION_KEY=your-encryption-key-for-client-side-crypto
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### 5. Run the Application

#### Option A: Run Backend and Frontend Separately

Terminal 1 - Start the backend server:
```bash
npm run server
```

Terminal 2 - Start the frontend development server:
```bash
npm run dev
```

#### Option B: Run Both Together (Development)

```bash
# Start backend in background
npm run server &

# Start frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Project Structure

```
password-vault-mvp/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   ├── generator/         # Password generator page
│   ├── vault/            # Vault page
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/            # React components
│   ├── Navbar.js         # Navigation component
│   ├── PasswordGenerator.js # Password generator component
│   ├── VaultItem.js      # Individual vault item component
│   └── VaultForm.js      # Add/edit vault item form
├── lib/                   # Utility libraries
│   ├── auth.js           # Authentication utilities
│   └── encryption.js     # Encryption utilities
├── server/               # Express.js backend
│   └── index.js          # Main server file
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── next.config.js        # Next.js configuration
└── README.md            # This file
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/health` - Health check

### Vault (Protected Routes)
- `GET /api/vault` - Get user's vault items
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/:id` - Update vault item
- `DELETE /api/vault/:id` - Delete vault item

## Security Considerations

### ✅ Implemented Security Features
- Client-side encryption using AES encryption
- JWT-based authentication with expiration
- Password hashing with bcryptjs
- CORS configuration
- Input validation and sanitization
- No plaintext password storage

### 🔒 Security Best Practices
- Use strong, unique secrets for JWT and encryption keys
- Keep your `.env` file secure and never commit it to version control
- Use HTTPS in production
- Regularly update dependencies
- Consider implementing rate limiting for production use

## Development

### Available Scripts

```bash
npm run dev          # Start Next.js development server
npm run build        # Build the application for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run server       # Start Express.js backend server
```

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String
}
```

#### Vault Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  encryptedData: String (encrypted vault item data)
}
```

## Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
PORT=5000
ENCRYPTION_KEY=your-production-encryption-key
NODE_ENV=production
```

### Build for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Roadmap

Future enhancements could include:

- [ ] Two-factor authentication (2FA)
- [ ] Password sharing between users
- [ ] Browser extension
- [ ] Password strength analysis
- [ ] Import/export functionality
- [ ] Dark mode theme
- [ ] Advanced search filters
- [ ] Password expiration reminders
- [ ] Audit logs
- [ ] API rate limiting
- [ ] Password breach detection

---

**Note**: This is an MVP (Minimum Viable Product) for educational and development purposes. For production use, consider additional security measures and testing.
