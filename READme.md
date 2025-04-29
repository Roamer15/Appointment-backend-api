# 📅 Appointment Booking API

A full-featured appointment scheduling RESTful API built with **Node.js**, **Express**, **PostgreSQL**, and **Socket.io** to support real-time notifications between clients and providers.

## 🚀 Features

- **User Authentication** (Clients and Providers)
- **Time Slot Management** (CRUD operations for providers)
- **Appointment Booking and Management**
- **Real-Time Notifications** using WebSockets
- **Swagger API Documentation**
- **Robust Testing** with Supertest and Node Test Runner
- **Environment-based Configuration** with `.env`

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Socket**: Socket.io
- **Validation**: Joi
- **Testing**: Supertest, Node.js `test` module
- **Logging**: Winston
- **Documentation**: Swagger UI

## 📂 Folder Structure

```
├── controllers/
├── routes/
├── middlewares/
├── validators/
├── config/
├── utils/
├── tests/
├── public/
├── app.js
├── server.js
└── README.md
```

## 📄 API Documentation

You can access the Swagger docs at:  
**`/api-docs`**

## 🧪 Running Tests

```bash
npm run test
```

## 🧾 Setup Instructions

1. Clone the repo  
2. Run `npm install`  
3. Create your `.env` file  
4. Migrate and seed your PostgreSQL database  
5. Run with:

```bash
npm start
```

## 🌐 Deployment (Render)

- Set up a new Web Service on [Render](https://render.com)
- Use a PostgreSQL database add-on or external provider
- Add all environment variables under **Render Settings**
- Add a `render.yaml` if needed for advanced config

## 📣 Real-Time Features

Socket.io is used to notify service providers when a new appointment is booked or cancelled. Providers join their own socket room using their user ID.

## ✅ Completed Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /providers/:id/view-timeslots`
- `POST /providers/:id/create-timeslots`
- `PUT /providers/:providerId/update-timeslot/:slotId`
- `DELETE /providers/:providerId/delete-timeslot/:slotId`
- `GET /providers/:id/available-slots`
- `POST /booking`
- `GET /view-bookings`
- `GET /provider/view-bookings/:id`
- `PATCH /:appointmentId/cancel`
- `PATCH /provider/:providerId/:appointmentId/cancel`
