Product Requirements Document (PRD)

PG Accommodation Management API

1. Product Overview

Product Name: PG Accommodation Management API
Version: 1.0.0
Product Type: RESTful Backend API

Overview

PG Accommodation Management API is a secure backend system that allows owners to list and manage Paying Guest (PG) accommodations while enabling tenants to discover, book, and review PG properties. The platform provides authentication, role-based access control, booking management, room management, amenities, reviews, and image management through REST APIs.

⸻

2. Target Users

Admin

* Manage the entire platform
* Verify and approve PG owners
* Approve or reject PG listings
* Manage users
* View analytics
* Remove inappropriate reviews or listings

PG Owners

* Register as an owner
* Create and manage PG listings
* Manage rooms
* Upload PG images
* Update amenities
* Accept or reject bookings
* Track occupancy

Tenants

* Register and verify account
* Search available PGs
* View PG details
* Book rooms
* Cancel bookings
* Write reviews and ratings
* Manage profile

⸻

3. Core Features

⸻

3.1 Authentication & Authorization

* User Registration
* User Login
* Logout
* JWT Authentication
* Refresh Token
* Email Verification
* Forgot Password
* Reset Password
* Change Password
* Role-Based Authorization
* Protected Routes

Roles

* ADMIN
* OWNER
* TENANT

⸻

3.2 Owner Management

* Become a PG Owner
* Owner Verification
* Owner Profile
* View Owner Dashboard
* Update Owner Information
* Manage Verification Status

⸻

3.3 PG Management

* Create PG
* Update PG
* Delete PG
* View All PGs
* View Single PG
* Search PG
* Filter PGs
* Approve PG (Admin)
* Reject PG (Admin)
* Manage Availability

⸻

3.4 Room Management

* Add Rooms
* Update Rooms
* Delete Rooms
* View Rooms
* Manage Occupancy
* Available Bed Tracking
* Room Type Management

Supported Room Types

* Single
* Double Sharing
* Triple Sharing
* Four Sharing

⸻

3.5 Amenities Management

Manage amenities for every PG

Examples

* WiFi
* Food
* AC
* Parking
* CCTV
* Power Backup
* Laundry
* Gym
* Housekeeping
* Water Supply

⸻

3.6 Booking Management

* Book Room
* Cancel Booking
* Accept Booking
* Reject Booking
* Booking History
* Active Bookings
* Booking Status

Booking Status

* Pending
* Confirmed
* Cancelled
* Completed

⸻

3.7 Review & Rating System

* Add Review
* Update Review
* Delete Review
* Average Rating
* View Reviews
* Owner Reply (Optional)

⸻

3.8 Image Management

* Upload Images
* Delete Images
* Multiple Images
* Cover Image
* Cloud Storage Support

⸻

3.9 Search & Filtering

Search by

* City
* State
* Gender Type
* Rent Range
* Amenities
* Availability
* Room Type

Sorting

* Lowest Rent
* Highest Rent
* Latest
* Highest Rating

⸻

3.10 Dashboard

Admin Dashboard

* Total Users
* Total Owners
* Total PGs
* Total Bookings
* Revenue Overview
* Pending Owner Approvals

Owner Dashboard

* My PGs
* Available Rooms
* Bookings
* Occupancy
* Earnings Overview

Tenant Dashboard

* My Bookings
* Booking History
* Saved PGs
* Reviews

⸻

3.11 Notifications

* Booking Confirmation
* Booking Cancellation
* Owner Verification
* Password Reset
* Email Verification

⸻

3.12 Health Check

API health monitoring endpoint.

⸻

4. Technical Specifications

4.1 API Routes

Authentication

Base URL

/api/v1/auth

Endpoints

POST   /register
POST   /login
POST   /logout
GET    /me
POST   /refresh-token
POST   /forgot-password
POST   /reset-password/:token
POST   /change-password
GET    /verify-email/:token
POST   /resend-verification

⸻

Users

/api/v1/users
GET    /profile
PUT    /profile
DELETE /profile

⸻

Owners

/api/v1/owners
POST   /
GET    /
GET    /:ownerId
PUT    /:ownerId
DELETE /:ownerId
PUT    /:ownerId/approve
PUT    /:ownerId/reject

⸻

PG

/api/v1/pgs
GET    /
POST   /
GET    /:pgId
PUT    /:pgId
DELETE /:pgId
GET    /search
GET    /featured
GET    /owner/:ownerId

⸻

Rooms

/api/v1/rooms
POST   /:pgId
GET    /:pgId
PUT    /:roomId
DELETE /:roomId

⸻

Amenities

/api/v1/amenities
GET    /:pgId
POST   /:pgId
PUT    /:pgId
DELETE /:pgId

⸻

Images

/api/v1/images
POST   /upload/:pgId
DELETE /:imageId
GET    /:pgId

⸻

Bookings

/api/v1/bookings
POST   /
GET    /
GET    /:bookingId
PUT    /:bookingId/confirm
PUT    /:bookingId/cancel
PUT    /:bookingId/complete

⸻

Reviews

/api/v1/reviews
POST   /:pgId
GET    /:pgId
PUT    /:reviewId
DELETE /:reviewId

⸻

Health Check

/api/v1/healthcheck
GET /

⸻

4.2 Permission Matrix

Feature	Admin	Owner	Tenant
Register/Login	✅	✅	✅
Create PG	❌	✅	❌
Update Own PG	❌	✅	❌
Delete Own PG	❌	✅	❌
Approve PG	✅	❌	❌
Approve Owner	✅	❌	❌
Manage Rooms	❌	✅	❌
Manage Amenities	❌	✅	❌
Upload Images	❌	✅	❌
Book Room	❌	❌	✅
Cancel Booking	❌	❌	✅
Confirm Booking	❌	✅	❌
Add Review	❌	❌	✅
Delete Review	✅	❌	❌
View PGs	✅	✅	✅

⸻

4.3 Database Models

User

* name
* email
* password
* phone
* role
* verified

⸻

Owner

* userId
* verificationStatus

⸻

PG

* ownerId
* name
* description
* address
* city
* state
* pincode
* latitude
* longitude
* genderType
* totalBeds
* availableBeds
* rentStartingFrom
* status

⸻

Room

* pgId
* roomType
* occupancy
* rent
* availableCount

⸻

Amenities

* pgId
* wifi
* food
* ac
* parking
* gym
* cctv
* washingMachine
* powerBackup

⸻

Image

* pgId
* imageUrl
* publicId

⸻

Booking

* tenantId
* roomId
* bookingStatus
* checkInDate
* checkOutDate

⸻

Review

* tenantId
* pgId
* rating
* comment

⸻

5. Security Features

* JWT Authentication
* Refresh Token Authentication
* Role-Based Authorization
* Password Hashing using bcrypt
* Input Validation using Zod
* MongoDB Injection Protection
* Secure File Uploads
* Email Verification
* Forgot Password
* Password Reset
* HTTP Security Headers
* CORS Protection
* API Rate Limiting

⸻

6. File Management

* Multiple Image Upload
* Image Deletion
* Cloudinary Storage
* Image Optimization
* Image Metadata
* Supported Formats (JPG, PNG, WEBP)

⸻

7. Technology Stack

Backend

* Node.js
* Express.js

Database

* MongoDB
* Mongoose

Authentication

* JWT
* bcrypt

Validation

* Zod

File Upload

* Multer
* Cloudinary

Security

* Helmet
* CORS
* Express Rate Limit

Logging

* Morgan

Environment

* dotenv

⸻

8. Success Criteria

* Secure authentication system
* Owner verification workflow
* Complete PG lifecycle management
* Room and bed availability tracking
* Real-time booking management
* Review and rating system
* Image upload functionality
* Role-based authorization
* RESTful API architecture
* Scalable MongoDB schema
* Clean modular project structure
* Production-ready backend with comprehensive API endpoints.