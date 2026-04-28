# API-TOK - BNSP Simulation System

A comprehensive web application for educational program registration and management, built with Node.js, Express, and Sequelize.

## Features

- **User Authentication**: Registration, login with JWT tokens
- **Profile Management**: Complete user profile with regional data
- **Program Management**: CRUD operations for educational programs
- **Enrollment System**: File upload for document submission
- **Payment Processing**: Simulated payment gateway integration
- **Reporting & Analytics**: Administrative statistics and reports
- **Role-Based Access Control**: Admin and Siswa roles

## API Documentation

### Base URL

```
https://syangkan.petik.or.id/api/v1
```

### Authentication Endpoints

#### POST /auth/register

Register a new user with profile data.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "nama_lengkap": "User Full Name",
  "nisn": "1234567890",
  "telepon": "081234567890",
  "alamat": "User Address",
  "provinsi_id": "32",
  "kota_id": "32.73",
  "kecamatan_id": "32.73.01"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Registration successful"
}
```

#### POST /auth/login

Authenticate user and return JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "siswa"
  }
}
```

#### GET /auth/me

Get current user profile information (protected endpoint).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "status": "success",
  "message": "User profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "siswa",
    "is_active": true,
    "profiles": {
      "nama_lengkap": "User Full Name",
      "nisn": "1234567890",
      "telepon": "081234567890",
      "alamat": "User Address",
      "provinsi_id": "32",
      "kota_id": "32.73",
      "kecamatan_id": "32.73.01"
    }
  }
}
```

### Programs Endpoints

#### GET /programs

Get all available programs (public access).

**Response:**

```json
{
  "status": "success",
  "message": "Programs retrieved successfully",
  "data": [
    {
      "id": 1,
      "nama_program": "Web Development Course",
      "deskripsi": "Learn modern web development",
      "biaya_pendaftaran": 1500000,
      "kuota": 30
    }
  ]
}
```

#### GET /programs/:id

Get specific program by ID (public access).

#### POST /programs

Create new program (admin only).

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**

```json
{
  "nama_program": "New Program",
  "deskripsi": "Program description",
  "biaya_pendaftaran": 1000000,
  "kuota": 25
}
```

#### PATCH /programs/:id

Update program (admin only).

#### DELETE /programs/:id

Delete program (admin only).

### Enrollment Endpoints

#### POST /pendaftar

Submit enrollment with file upload (siswa only).

**Headers:**

```
Authorization: Bearer <siswa_jwt_token>
Content-Type: multipart/form-data
```

**Request Body:**

```
program_id: 1
ijazah: <file>
```

**Response:**

```json
{
  "status": "success",
  "message": "Enrollment created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "program_id": 1,
    "ijazah_path": "/home/pc-4/Desktop/api-tok/src/uploads/ijazah-1234567890.jpg",
    "status_pendaftaran": "pending",
    "status_pembayaran": "unpaid"
  }
}
```

#### GET /pendaftar/me

Get current user's enrollments (siswa only).

#### GET /pendaftar

Get all enrollments (admin only).

#### PATCH /pendaftar/:id/status

Update enrollment status (admin only).

**Request Body:**

```json
{
  "status": "terverifikasi",
  "catatan_admin": "Documents verified"
}
```

### Payment Endpoints

#### POST /payments/charge

Generate payment token for enrollment.

**Request Body:**

```json
{
  "pendaftar_id": 1
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Payment charge created successfully",
  "data": {
    "order_id": "ORDER-1234567890-123",
    "gross_amount": 1500000,
    "snap_token": "SNAP-TOKEN-ORDER-1234567890-123-1234567890"
  }
}
```

#### POST /payments/notification

Process payment notifications from Midtrans (public endpoint).

**Request Body:**

```json
{
  "order_id": "ORDER-1234567890-123",
  "status_code": "200",
  "gross_amount": "1500000.00",
  "transaction_status": "settlement",
  "signature_key": "..."
}
```

**Response:**

```json
{
  "status": "success",
  "message": "OK"
}
```

### Reports Endpoints

#### GET /reports/stats

Get administrative statistics (admin only).

**Response:**

```json
{
  "status": "success",
  "message": "Statistics retrieved successfully",
  "data": {
    "totalRegistrations": 25,
    "totalRevenue": 25000000,
    "registrationsByProgram": [
      {
        "program_id": 1,
        "program_name": "Web Development Course",
        "count": 15
      }
    ],
    "registrationsByProvince": [
      {
        "provinsi_id": "32",
        "count": 10
      }
    ]
  }
}

### Dashboard Endpoints

#### GET /dashboard/siswa/stats

Get current user's registration statistics (siswa only).

**Headers:**

```
Authorization: Bearer <siswa_jwt_token>
```

**Response:**

```json
{
  "status": "success",
  "message": "Student stats fetched successfully",
  "data": {
    "total_enrollments": 1,
    "active_status": "pending",
    "payment_status": "unpaid"
  }
}
```

#### GET /dashboard/admin/analytics

Get high-level management analytics and visualizations (admin only).

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Response:**

```json
{
  "status": "success",
  "message": "Admin analytics fetched successfully",
  "data": {
    "monthly_registration_trend": [
      {
        "month": "2026-01",
        "count": 5
      }
    ],
    "program_distribution": [
      {
        "name": "Web Development Course",
        "count": 10
      }
    ],
    "payment_ratio": [
      {
        "status_pembayaran": "paid",
        "count": 15
      }
    ],
    "kpi_cards": {
      "total_registered_users": 50,
      "total_revenue": 15000000,
      "pending_document_reviews": 5
    }
  }
}
```

```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access Control

- **Admin**: Full access to all endpoints
- **Siswa**: Limited access to enrollment and profile endpoints

## Project Structure

```
src/
├── app.js                    # Main application setup
├── server.js                 # Server configuration
├── config/
│   └── sequelize.js          # Database configuration
├── db/
│   └── models/               # Sequelize models
├── module/
│   ├── auth/                 # Authentication module
│   ├── programs/             # Programs management
│   ├── pendaftar/            # Enrollment management
│   ├── payments/             # Payment processing
│   └── reports/              # Reporting module
├── shared/
│   ├── middlewares/          # Custom middlewares
│   └── utils/                # Utility functions
└── uploads/                  # File upload directory
```

## Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your database and SMTP credentials
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Server runs on:** `https://syangkan.petik.or.id

## Database Schema

### Users Table

- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `role` (siswa/admin)
- `is_active` (Boolean)

### Profiles Table

- `user_id` (Foreign Key)
- `nama_lengkap`
- `nisn` (Unique)
- `telepon`
- `alamat`
- `provinsi_id`
- `kota_id`
- `kecamatan_id`

### Programs Table

- `id` (Primary Key)
- `nama_program`
- `deskripsi`
- `biaya_pendaftaran`
- `kuota`

### Pendaftar Table

- `id` (Primary Key)
- `user_id` (Foreign Key)
- `program_id` (Foreign Key)
- `ijazah_path`
- `status_pendaftaran`
- `status_pembayaran`
- `catatan_admin`

### Payments Table

- `id` (Primary Key)
- `pendaftar_id` (Foreign Key)
- `order_id` (Unique)
- `gross_amount`
- `snap_token`
- `transaction_status`

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email notifications
- **express-validator** - Input validation

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Testing

Run comprehensive tests using the provided test scripts:

```bash
# Run all tests
npm test

# Run specific module tests
npm test -- --grep "Auth"
npm test -- --grep "Programs"
```

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Support

For support and questions, please contact the development team.
