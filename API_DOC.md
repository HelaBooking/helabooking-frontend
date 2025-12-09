
* **User Service**: `{{baseUrl1}}` → `http://localhost:8081`
* **Event Service**: `{{baseUrl2}}` → `http://localhost:8082`
* **Booking Service**: `{{baseUrl3}}` → `http://localhost:8083`
* **Ticketing Service**: `{{baseUrl4}}` → `http://localhost:8084`

---

## 1) User Service

### 1.1 Health Check

**Request**

* **Method**: GET
* **URL**: `{{baseUrl1}}/api/users/health`

**Payload**

* None

**Response**

* **200 OK**

  * **Schema**

    * `status`: `string`
    * `service`: `string`
    * `timestamp`: `string (ISO 8601)`
  * **Sample**

```json
{
  "status": "UP",
  "service": "user-service",
  "timestamp": "2025-12-09T09:10:00+05:30"
}
```

---

### 1.2 Register User (USER/AUDITOR/ADMIN)

**Request**

* **Method**: POST
* **URL**: `{{baseUrl1}}/api/users/register`
* **Headers**

  * `Authorization: Bearer {{adminToken}}`
  * `Content-Type: application/json`
* **Description (from collection)**: Register a new user with optional role (USER, AUDITOR, ADMIN). Default is USER.

**Payload**

* **Schema**

  * `username`: `string`
  * `email`: `string`
  * `password`: `string`
  * `role`: `string` *(optional; enum: USER | AUDITOR | ADMIN)*
* **Sample**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "USER"
}
```

**Response**

* **201 Created** (typical)

  * **Schema**

    * `id`: `number`
    * `username`: `string`
    * `email`: `string`
    * `role`: `string`
    * `active`: `boolean`
    * `token`: `string` *(your tests expect this to exist)*
    * `createdAt`: `string (ISO 8601)`
  * **Sample**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "active": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "createdAt": "2025-12-09T09:12:00+05:30"
}
```

---

### 1.3 Register Admin User

*(Same endpoint, different payload role)*

**Request**

* **Method**: POST
* **URL**: `{{baseUrl1}}/api/users/register`
* **Headers**

  * `Authorization: Bearer {{adminToken}}`
  * `Content-Type: application/json`

**Payload**

* **Schema**: same as Register User
* **Sample**

```json
{
  "username": "admin_user",
  "email": "admin@example.com",
  "password": "AdminPass123",
  "role": "ADMIN"
}
```

**Response**

* **201 Created**

  * **Schema**: same as Register User
  * **Sample**

```json
{
  "id": 2,
  "username": "admin_user",
  "email": "admin@example.com",
  "role": "ADMIN",
  "active": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "createdAt": "2025-12-09T09:13:00+05:30"
}
```

---

### 1.4 Login User

**Request**

* **Method**: POST
* **URL**: `{{baseUrl1}}/api/users/login`
* **Headers**

  * `Authorization: Bearer {{adminToken}}` *(present in collection; unusual for login but documenting as-is)*
  * `Content-Type: application/json`
* **Description**: Login with username and password. Returns user details including role.

**Payload**

* **Schema**

  * `username`: `string`
  * `password`: `string`
* **Sample**

```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response**

* **200 OK**

  * **Schema**

    * `id`: `number`
    * `username`: `string`
    * `email`: `string`
    * `role`: `string`
    * `active`: `boolean`
    * `token`: `string` *(your tests expect this)*
    * `lastLoginAt`: `string (ISO 8601)`
  * **Sample**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "active": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "lastLoginAt": "2025-12-09T09:15:00+05:30"
}
```

---

### 1.5 Get User Profile

**Request**

* **Method**: GET
* **URL**: `{{baseUrl1}}/api/users/{{userId}}/profile`

**Payload**

* None

**Response**

* **200 OK**

  * **Schema**

    * `id`: `number`
    * `username`: `string`
    * `email`: `string`
    * `role`: `string`
    * `active`: `boolean`
    * `createdAt`: `string (ISO 8601)`
    * `updatedAt`: `string (ISO 8601)`
  * **Sample**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "active": true,
  "createdAt": "2025-12-01T10:00:00+05:30",
  "updatedAt": "2025-12-09T09:16:00+05:30"
}
```

---

### 1.6 Update User Role

**Request**

* **Method**: PUT
* **URL**: `{{baseUrl1}}/api/users/{{userId}}/role`
* **Headers**

  * `Authorization: Bearer {{adminToken}}`
  * `Content-Type: application/json`

**Payload**

* **Schema**

  * `role`: `string` *(enum: USER | AUDITOR | ADMIN)*
* **Sample**

```json
{
  "role": "AUDITOR"
}
```

**Response**

* **200 OK**

  * **Schema**

    * `id`: `number`
    * `role`: `string`
    * `updatedAt`: `string (ISO 8601)`
  * **Sample**

```json
{
  "id": 1,
  "role": "AUDITOR",
  "updatedAt": "2025-12-09T09:18:00+05:30"
}
```

---

## 2) Event Service

### 2.1 Health Check

**Request**

* **Method**: GET
* **URL**: `{{baseUrl2}}/api/events/health`

**Payload**

* None

**Response**

* **200 OK**

```json
{
  "status": "UP",
  "service": "event-service",
  "timestamp": "2025-12-09T09:20:00+05:30"
}
```

---

### 2.2 Create Event

**Request**

* **Method**: POST
* **URL**: `{{baseUrl2}}/api/events`
* **Headers**

  * `Authorization: Bearer {{adminToken}}`
  * `Content-Type: application/json`
* **Description**: Create a new event with full metadata. Status defaults to DRAFT.

**Payload**

* **Schema**

  * `name`: `string`
  * `description`: `string`
  * `location`: `string`
  * `venue`: `string`
  * `agenda`: `string`
  * `categories`: `string` *(comma-separated)*
  * `eventDate`: `string (ISO 8601 datetime)`
  * `endDate`: `string (ISO 8601 datetime)`
  * `isRecurring`: `boolean`
  * `recurrencePattern`: `string | null` *(enum likely: DAILY | WEEKLY | MONTHLY)*
  * `isMultiSession`: `boolean`
  * `capacity`: `number`
* **Sample**

```json
{
  "name": "Tech Conference 2027",
  "description": "Annual technology conference featuring latest innovations",
  "location": "San Francisco Convention Center",
  "venue": "Main Hall A",
  "agenda": "09:00 - Registration\n10:00 - Keynote Speech\n12:00 - Lunch Break\n13:00 - Technical Sessions\n17:00 - Closing Remarks",
  "categories": "Technology,Conference,Networking,Innovation",
  "eventDate": "2027-06-15T09:00:00",
  "endDate": "2027-06-15T18:00:00",
  "isRecurring": false,
  "recurrencePattern": null,
  "isMultiSession": true,
  "capacity": 500
}
```

**Response**

* **201 Created**

  * **Schema**

    * `id`: `number`
    * *(echo of event fields)*
    * `status`: `string` *(likely DRAFT | PUBLISHED | CANCELLED)*
    * `availableSeats`: `number`
    * `createdAt`: `string`
  * **Sample**

```json
{
  "id": 1,
  "name": "Tech Conference 2027",
  "description": "Annual technology conference featuring latest innovations",
  "location": "San Francisco Convention Center",
  "venue": "Main Hall A",
  "agenda": "09:00 - Registration\n10:00 - Keynote Speech\n12:00 - Lunch Break\n13:00 - Technical Sessions\n17:00 - Closing Remarks",
  "categories": "Technology,Conference,Networking,Innovation",
  "eventDate": "2027-06-15T09:00:00",
  "endDate": "2027-06-15T18:00:00",
  "isRecurring": false,
  "recurrencePattern": null,
  "isMultiSession": true,
  "capacity": 500,
  "availableSeats": 500,
  "status": "DRAFT",
  "createdAt": "2025-12-09T09:25:00+05:30"
}
```

---

### 2.3 Create Recurring Event

*(Same endpoint; key difference is `isRecurring=true`)*

**Request**

* **Method**: POST
* **URL**: `{{baseUrl2}}/api/events`
* **Headers**

  * `Authorization: Bearer {{adminToken}}`
  * `Content-Type: application/json`

**Payload Sample**

```json
{
  "name": "Weekly Yoga Class",
  "description": "Relaxing yoga sessions for all levels",
  "location": "Wellness Center",
  "venue": "Studio 2",
  "agenda": "Warm-up, Main session, Cool-down",
  "categories": "Wellness,Yoga,Fitness",
  "eventDate": "2025-07-01T18:00:00",
  "endDate": "2025-07-01T19:30:00",
  "isRecurring": true,
  "recurrencePattern": "WEEKLY",
  "isMultiSession": false,
  "capacity": 30
}
```

**Response**

* **201 Created** (same schema as Create Event)

---

### 2.4 Get All Events

**Request**

* **Method**: GET
* **URL**: `{{baseUrl2}}/api/events`

**Payload**

* None

**Response**

* **200 OK**

  * **Schema**: `array` of Event objects
  * **Sample**

```json
[
  {
    "id": 1,
    "name": "Tech Conference 2027",
    "status": "DRAFT",
    "eventDate": "2027-06-15T09:00:00",
    "endDate": "2027-06-15T18:00:00",
    "capacity": 500,
    "availableSeats": 500
  }
]
```

---

### 2.5 Get Event by ID

**Request**

* **Method**: GET
* **URL**: `{{baseUrl2}}/api/events/{{eventId}}`

**Payload**

* None

**Response**

* **200 OK**

  * **Schema**: Event object
  * **Sample**

```json
{
  "id": 1,
  "name": "Tech Conference 2027",
  "description": "Annual technology conference featuring latest innovations",
  "location": "San Francisco Convention Center",
  "venue": "Main Hall A",
  "agenda": "09:00 - Registration\n10:00 - Keynote Speech\n...",
  "categories": "Technology,Conference,Networking,Innovation",
  "eventDate": "2027-06-15T09:00:00",
  "endDate": "2027-06-15T18:00:00",
  "isRecurring": false,
  "recurrencePattern": null,
  "isMultiSession": true,
  "capacity": 500,
  "availableSeats": 500,
  "status": "DRAFT"
}
```

---

### 2.6 Update Event

**Request**

* **Method**: PUT
* **URL**: `{{baseUrl2}}/api/events/{{eventId}}`
* **Headers**

  * `Content-Type: application/json`

**Payload**

* **Schema**: same fields as Create Event
* **Sample**

```json
{
  "name": "Tech Conference 2025 - Updated",
  "description": "Annual technology conference - Now with AI track!",
  "location": "San Francisco Convention Center",
  "venue": "Main Hall B",
  "agenda": "09:00 - Registration\n10:00 - Keynote Speech\n11:00 - AI Workshop\n...",
  "categories": "Technology,Conference,AI,Networking",
  "eventDate": "2025-06-15T09:00:00",
  "endDate": "2025-06-15T19:00:00",
  "isRecurring": false,
  "recurrencePattern": null,
  "isMultiSession": true,
  "capacity": 600
}
```

**Response**

* **200 OK**

```json
{
  "id": 1,
  "name": "Tech Conference 2025 - Updated",
  "status": "DRAFT",
  "capacity": 600,
  "availableSeats": 600,
  "updatedAt": "2025-12-09T09:30:00+05:30"
}
```

---

### 2.7 Publish Event

**Request**

* **Method**: POST
* **URL**: `{{baseUrl2}}/api/events/{{eventId}}/publish`
* **Headers**

  * `Authorization: Bearer {{adminToken}}`

**Payload**

* None

**Response**

* **200 OK**

```json
{
  "id": 1,
  "status": "PUBLISHED",
  "publishedAt": "2025-12-09T09:32:00+05:30"
}
```

---

### 2.8 Get Published Events

**Request**

* **Method**: GET
* **URL**: `{{baseUrl2}}/api/events/published`

**Payload**

* None

**Response**

* **200 OK**

```json
[
  {
    "id": 1,
    "name": "Tech Conference 2027",
    "status": "PUBLISHED",
    "eventDate": "2027-06-15T09:00:00",
    "availableSeats": 420
  }
]
```

---

### 2.9 Reserve Seats

**Request**

* **Method**: POST
* **URL**: `{{baseUrl2}}/api/events/{{eventId}}/reserve?seats=25`
* **Query Params**

  * `seats`: `number`

**Payload**

* None

**Response**

* **200 OK**

  * **Schema**

    * `eventId`: `number`
    * `reservedSeats`: `number`
    * `availableSeats`: `number`
    * `status`: `string`
  * **Sample**

```json
{
  "eventId": 1,
  "reservedSeats": 25,
  "availableSeats": 475,
  "status": "DRAFT"
}
```

---

### 2.10 Delete Event

**Request**

* **Method**: DELETE
* **URL**: `{{baseUrl2}}/api/events/{{eventId}}`
* **Headers**

  * `Authorization: Bearer {{adminToken}}`

**Payload**

* None

**Response**

* **200 OK** *(or 204 typical)*

```json
{
  "message": "Event deleted successfully",
  "id": 1
}
```

---

## 3) Booking Service

### 3.1 Health Check

**Request**

* **Method**: GET
* **URL**: `{{baseUrl3}}/api/bookings/health`

**Payload**

* None

**Response**

* **200 OK**

```json
{
  "status": "UP",
  "service": "booking-service",
  "timestamp": "2025-12-09T09:35:00+05:30"
}
```

---

### 3.2 Create Booking

*(Covers PAID/VIP/FREE/GROUP via `ticketType`)*

**Request**

* **Method**: POST
* **URL**: `{{baseUrl3}}/api/bookings`
* **Headers**

  * `Content-Type: application/json`
* **Description**: Total price calculated automatically. Includes overbooking prevention.

**Payload**

* **Schema**

  * `userId`: `number`
  * `eventId`: `number`
  * `numberOfTickets`: `number`
  * `ticketType`: `string` *(enum: FREE | PAID | VIP | GROUP)*
  * `pricePerTicket`: `number`
* **Sample**

```json
{
  "userId": 1,
  "eventId": 1,
  "numberOfTickets": 3,
  "ticketType": "PAID",
  "pricePerTicket": 299.99
}
```

**Response**

* **201 Created**

  * **Schema**

    * `id`: `number`
    * `userId`: `number`
    * `eventId`: `number`
    * `numberOfTickets`: `number`
    * `ticketType`: `string`
    * `pricePerTicket`: `number`
    * `totalPrice`: `number`
    * `status`: `string` *(likely CONFIRMED | PENDING | CANCELLED)*
    * `createdAt`: `string`
  * **Sample**

```json
{
  "id": 1,
  "userId": 1,
  "eventId": 1,
  "numberOfTickets": 3,
  "ticketType": "PAID",
  "pricePerTicket": 299.99,
  "totalPrice": 899.97,
  "status": "CONFIRMED",
  "createdAt": "2025-12-09T09:40:00+05:30"
}
```

---

### 3.3 Get All Bookings

**Request**

* **Method**: GET
* **URL**: `{{baseUrl3}}/api/bookings`

**Payload**

* None

**Response**

* **200 OK**

```json
[
  {
    "id": 1,
    "userId": 1,
    "eventId": 1,
    "numberOfTickets": 3,
    "ticketType": "PAID",
    "totalPrice": 899.97,
    "status": "CONFIRMED"
  }
]
```

---

### 3.4 Get Booking by ID

**Request**

* **Method**: GET
* **URL**: `{{baseUrl3}}/api/bookings/{{bookingId}}`

**Payload**

* None

**Response**

* **200 OK**

```json
{
  "id": 1,
  "userId": 1,
  "eventId": 1,
  "numberOfTickets": 3,
  "ticketType": "PAID",
  "pricePerTicket": 299.99,
  "totalPrice": 899.97,
  "status": "CONFIRMED"
}
```

---

### 3.5 Get Bookings by User ID

**Request**

* **Method**: GET
* **URL**: `{{baseUrl3}}/api/bookings/user/{{userId}}`

**Payload**

* None

**Response**

* **200 OK**

```json
[
  {
    "id": 1,
    "eventId": 1,
    "numberOfTickets": 3,
    "ticketType": "PAID",
    "totalPrice": 899.97,
    "status": "CONFIRMED"
  }
]
```

---

## 4) Ticketing Service

### 4.1 Health Check

**Request**

* **Method**: GET
* **URL**: `{{baseUrl4}}/api/tickets/health`

**Payload**

* None

**Response**

* **200 OK**

```json
{
  "status": "UP",
  "service": "ticketing-service",
  "timestamp": "2025-12-09T09:45:00+05:30"
}
```

---

### 4.2 Get Tickets by Booking

**Request**

* **Method**: GET
* **URL**: `{{baseUrl4}}/api/tickets/booking/{{bookingId}}`
* **Description**: Each ticket includes QR code and barcode.

**Payload**

* None

**Response**

* **200 OK**

  * **Schema**: `array` of Ticket

    * `id`: `number`
    * `ticketNumber`: `string`
    * `bookingId`: `number`
    * `userId`: `number`
    * `eventId`: `number`
    * `ticketType`: `string`
    * `qrCode`: `string` *(likely base64 or URL)*
    * `barCode`: `string`
    * `status`: `string` *(likely ACTIVE | USED | CANCELLED)*
  * **Sample**

```json
[
  {
    "id": 101,
    "ticketNumber": "TICKET-D306A29B",
    "bookingId": 1,
    "userId": 1,
    "eventId": 1,
    "ticketType": "PAID",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAA...",
    "barCode": "987654321012",
    "status": "ACTIVE"
  }
]
```

---

### 4.3 Get Tickets by User

**Request**

* **Method**: GET
* **URL**: `{{baseUrl4}}/api/tickets/user/{{userId}}`

**Payload**

* None

**Response**

* **200 OK**

```json
[
  {
    "id": 101,
    "ticketNumber": "TICKET-D306A29B",
    "bookingId": 1,
    "userId": 1,
    "eventId": 1,
    "ticketType": "PAID",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAA...",
    "barCode": "987654321012",
    "status": "ACTIVE"
  }
]
```

---

### 4.4 Get Ticket by Number

**Request**

* **Method**: GET
* **URL**: `{{baseUrl4}}/api/tickets/{{ticketNumber}}`
* **Example in collection**: `TICKET-D306A29B`

**Payload**

* None

**Response**

* **200 OK**

```json
{
  "id": 101,
  "ticketNumber": "TICKET-D306A29B",
  "bookingId": 1,
  "userId": 1,
  "eventId": 1,
  "ticketType": "PAID",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAA...",
  "barCode": "987654321012",
  "status": "ACTIVE"
}
```

---

## Common Enums (derived from collection)

### User Roles

* `USER`
* `AUDITOR`
* `ADMIN`

### Event Recurrence Patterns

* `DAILY`
* `WEEKLY`
* `MONTHLY`

### Booking Ticket Types

* `FREE`
* `PAID`
* `VIP`
* `GROUP`



