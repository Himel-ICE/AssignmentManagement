# Assignment Management System

A Role-Based Assignment Management System built with **ASP.NET Core 8 Web API**, **PostgreSQL**, **Entity Framework Core**, **JWT Authentication**, **Repository Pattern**, and **Unit of Work**.

This project enables educational institutions to manage users, academic classes, subjects, teacher assignments, student assignment submissions, and evaluation through a secure RESTful API.

---

# Features

## Authentication & Authorization

- JWT Authentication
- Role-Based Authorization
- Secure API Access
- Swagger JWT Support

---

## User Management

- Create User
- Update User
- Delete User (Soft Delete)
- Get User
- Get All Users
- User Login

---

## Academic Class Management

- Create Class
- Update Class
- Delete Class
- Get Class List

---

## Subject Management

- Create Subject
- Update Subject
- Delete Subject
- Get Subject List

---

## Teacher-Class-Subject Management

- Assign Teacher to Class
- Assign Subject to Teacher
- Prevent Duplicate Mapping
- View Assignments

---

## Assignment Management

- Create Assignment
- Update Assignment
- Delete Assignment
- Publish Assignment
- Close Assignment
- View Assignments

---

## Submission Management

- Submit Assignment
- Update Submission
- Teacher Review
- Marks & Feedback

---

# Technology Stack

## Backend

- ASP.NET Core 8 Web API
- Entity Framework Core
- PostgreSQL
- AutoMapper
- JWT Authentication
- Swagger

---

## Design Pattern

- Repository Pattern
- Unit Of Work Pattern
- Dependency Injection
- DTO Pattern

---

## Testing

- xUnit
- Moq
- Integration Testing

---


# System Workflow

```
Admin
   │
   ├── Create Users
   ├── Create Classes
   ├── Create Subjects
   └── Assign Teacher
            │
            ▼
Teacher
   │
   ├── Create Assignment
   ├── Publish Assignment
   └── Review Submission
            │
            ▼
Student
   │
   ├── View Assignment
   ├── Submit Assignment
   └── View Result
```

---

# Database

Database backup is available inside the **Database** folder.

Restore the backup before running the application.

Alternatively, you may use Entity Framework migrations.

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Himel-ICE/AssignmentManagement.git
```

---

## Navigate

```bash
cd AssignmentManagement
```

---

## Update Connection String

Edit

```
appsettings.json
```

Example

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=AssignmentSystem;Username=postgres;Password=your_password"
}
```

---

## Restore Database

Using PostgreSQL Backup

or

Run Migration

```bash
dotnet ef database update
```

---

## Restore Packages

```bash
dotnet restore
```

---

## Run Application

```bash
dotnet run
```

---

Swagger

```
https://localhost:xxxx/swagger
```

---

# Demo Credentials

## Admin

```
Email:
admin@example.com

Password:
********
```

---

## Teacher

```
Email:
teacher@example.com

Password:
********
```

---

## Student

```
Email:
student@example.com

Password:
********
```

> Replace these credentials with the actual seeded accounts before submission.

---

# API Response Format

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully.",
  "data": {},
  "errors": null
}
```

---

# Security

- JWT Authentication
- Role-Based Authorization
- Global Exception Handling
- Soft Delete
- Input Validation

---

# Business Rules

- One Email per User
- One Phone per User
- Subject Code must be Unique
- Duplicate Teacher-Class-Subject mapping is not allowed
- Assignment Deadline must be in the Future
- Marks cannot exceed Maximum Marks
- Closed Assignments cannot be modified

---

# Testing

Run Unit Tests

```bash
dotnet test
```

---

# Future Improvements

- Email Notification
- File Upload
- Dashboard Analytics
- Assignment Reminder
- Docker Support
- CI/CD Pipeline

---

# Author

**MD. Zamiul Islam Himel**

Application Developer

ASP.NET Core | C# | PostgreSQL | Entity Framework Core

GitHub:
https://github.com/Himel-ICE

LinkedIn:
(Add your LinkedIn profile URL)

---

# License

This project was developed as part of a Software Engineer recruitment assessment and is intended for educational and evaluation purposes.
