# API Documentation - API-TOK

This repository contains the backend API for the API-TOK application. The API provides user authentication, program management, student enrollment (pendaftaran), payment processing (including Midtrans webhook integration), and administration reporting.

## Base URL
All API endpoints are prefixed with `/api/v1`.

---

## 1. Auth Module (`/api/v1/auth`)

### 1.1 Register New User
- **URL:** `/api/v1/auth/register`
- **Method:** `POST`
- **Access:** Public
- **Description:** Register a new student (Siswa) account.

**Request Body:**
```json
{
  "email": "gege@gmail.com",
  "password": "gege123",
  "nama_lengkap": "Ahmad Gege",
  "nisn": "3214567880",
  "telepon": "081234567890",
  "alamat": "Jl Pramuka",
  "provinsi_id": "32",
  "kota_id": "32.73",
  "kecamatan_id": "49"
}
```

**Success Response (201 Created):**
```json
{
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": 1,
      "email": "siswa@example.com",
      "role": "siswa"
    },
    "profile": {
      "nama_lengkap": "Budi Santoso",
      "nisn": "1234567890"
    }
  }
}
```

### 1.2 User Login
- **URL:** `/api/v1/auth/login`
- **Method:** `POST`
- **Access:** Public
- **Description:** Authenticate user and return a JWT token.

**Request Body:**
```json
{
  "email": "siswa@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": 1,
      "email": "siswa@example.com",
      "role": "siswa"
    }
  }
}
```

---

## 2. Programs Module (`/api/v1/programs`)

### 2.1 Get All Programs
- **URL:** `/api/v1/programs`
- **Method:** `GET`
- **Access:** Public

**Success Response (200 OK):**
```json
{
  "message": "Berhasil mengambil data program",
  "data": [
    {
      "id": 1,
      "nama_program": "Program Beasiswa Unggulan",
      "deskripsi": "Deskripsi program...",
      "biaya_pendaftaran": 150000,
      "kuota": 100
    }
  ]
}
```

### 2.2 Get Program Details
- **URL:** `/api/v1/programs/:id`
- **Method:** `GET`
- **Access:** Public

**Success Response (200 OK):**
```json
{
  "message": "Berhasil mengambil data program",
  "data": {
    "id": 1,
    "nama_program": "Program Beasiswa Unggulan",
    "deskripsi": "Deskripsi program...",
    "biaya_pendaftaran": 150000,
    "kuota": 100
  }
}
```

### 2.3 Create Program
- **URL:** `/api/v1/programs`
- **Method:** `POST`
- **Access:** Admin (requires Bearer Token)

**Request Body:**
```json
{
  "nama_program": "Program Reguler",
  "deskripsi": "Deskripsi lengkap program reguler.",
  "biaya_pendaftaran": 200000,
  "kuota": 50
}
```

**Success Response (201 Created):**
```json
{
  "message": "Program berhasil dibuat",
  "data": {
    "id": 2,
    "nama_program": "Program Reguler",
    "biaya_pendaftaran": 200000,
    "kuota": 50
  }
}
```

### 2.4 Update Program
- **URL:** `/api/v1/programs/:id`
- **Method:** `PATCH`
- **Access:** Admin (requires Bearer Token)

**Request Body:**
```json
{
  "kuota": 75,
  "biaya_pendaftaran": 250000
}
```

**Success Response (200 OK):**
```json
{
  "message": "Program berhasil diupdate",
  "data": {
    "id": 2,
    "nama_program": "Program Reguler",
    "biaya_pendaftaran": 250000,
    "kuota": 75
  }
}
```

### 2.5 Delete Program
- **URL:** `/api/v1/programs/:id`
- **Method:** `DELETE`
- **Access:** Admin (requires Bearer Token)

**Success Response (200 OK):**
```json
{
  "message": "Program berhasil dihapus"
}
```

---

## 3. Pendaftar (Enrollment) Module (`/api/v1/pendaftar`)

### 3.1 Create Enrollment (Pendaftaran Baru)
- **URL:** `/api/v1/pendaftar`
- **Method:** `POST`
- **Access:** Siswa (requires Bearer Token)
- **Content-Type:** `multipart/form-data`

**Form Data:**
- `program_id` (Integer): ID of the program to enroll in
- `ijazah` (File): Upload ijazah document (JPG/PNG/PDF)

**Success Response (201 Created):**
```json
{
  "message": "Pendaftaran berhasil",
  "data": {
    "id": 1,
    "user_id": 1,
    "program_id": 2,
    "ijazah_path": "/uploads/ijazah-168123456789.jpg",
    "status_pendaftaran": "pending",
    "status_pembayaran": "unpaid"
  }
}
```

### 3.2 Get My Enrollments
- **URL:** `/api/v1/pendaftar/me`
- **Method:** `GET`
- **Access:** Siswa (requires Bearer Token)

**Success Response (200 OK):**
```json
{
  "message": "Berhasil mengambil riwayat pendaftaran",
  "data": [
    {
      "id": 1,
      "program_id": 2,
      "status_pendaftaran": "pending",
      "status_pembayaran": "unpaid",
      "programs": {
        "nama_program": "Program Reguler"
      }
    }
  ]
}
```

### 3.3 Get All Enrollments
- **URL:** `/api/v1/pendaftar`
- **Method:** `GET`
- **Access:** Admin (requires Bearer Token)

**Success Response (200 OK):**
```json
{
  "message": "Berhasil mengambil semua data pendaftar",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "program_id": 2,
      "status_pendaftaran": "pending",
      "status_pembayaran": "paid"
    }
  ]
}
```

### 3.4 Update Enrollment Status
- **URL:** `/api/v1/pendaftar/:id/status`
- **Method:** `PATCH`
- **Access:** Admin (requires Bearer Token)

**Request Body:**
```json
{
  "status": "terverifikasi",
  "catatan_admin": "Dokumen lengkap dan valid"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Status pendaftaran berhasil diupdate",
  "data": {
    "status_pendaftaran": "terverifikasi",
    "catatan_admin": "Dokumen lengkap dan valid"
  }
}
```

---

## 4. Payments Module (`/api/v1/payments`)

### 4.1 Generate Payment Charge
- **URL:** `/api/v1/payments/charge`
- **Method:** `POST`
- **Access:** Siswa/Admin (requires Bearer Token)

**Request Body:**
```json
{
  "pendaftar_id": 1
}
```

**Success Response (201 Created):**
```json
{
  "message": "Payment token generated successfully",
  "data": {
    "order_id": "ORDER-1681234567-456",
    "gross_amount": 200000,
    "snap_token": "SNAP-TOKEN-ORDER-1681234567-456",
    "transaction_status": "pending"
  }
}
```

### 4.2 Midtrans Webhook Notification
- **URL:** `/api/v1/payments/webhook`
- **Method:** `POST`
- **Access:** Public (Used by Midtrans)

**Request Body (Example from Midtrans):**
```json
{
  "order_id": "ORDER-1681234567-456",
  "transaction_status": "settlement",
  "gross_amount": 200000
}
```

**Success Response (200 OK):**
```json
{
  "message": "Webhook processed successfully"
}
```

---

## 5. Reports Module (`/api/v1/reports`)

### 5.1 Get Statistics
- **URL:** `/api/v1/reports/stats`
- **Method:** `GET`
- **Access:** Admin (requires Bearer Token)
- **Description:** Retrieve dashboard statistics including total revenue, total approved registrations, and distribution by program and province.

**Success Response (200 OK):**
```json
{
  "message": "Berhasil mengambil statistik laporan",
  "data": {
    "totalRegistrations": 150,
    "totalRevenue": 25000000,
    "registrationsByProgram": [
      {
        "program_id": 1,
        "program_name": "Program Beasiswa Unggulan",
        "count": 50
      },
      {
        "program_id": 2,
        "program_name": "Program Reguler",
        "count": 100
      }
    ],
    "registrationsByProvince": [
      {
        "provinsi_id": "31",
        "count": 75
      },
      {
        "provinsi_id": "32",
        "count": 75
      }
    ]
  }
}
```
