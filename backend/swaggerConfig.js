// import swaggerJsdoc from 'swagger-jsdoc';

// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Boys Quarter API - Appointment Booking Platform',
//       version: '1.0.0',
//       description: 'A REST API connecting clients with service providers to manage bookings, schedules, and profiles.',
//       contact: {
//         name: 'Ian (Beleke Ian)',
//         url: 'https://www.linkedin.com/in/belekeian/',
//         email: 'beleke.ian@example.com',
//       },
//       license: {
//         name: 'MIT',
//         url: 'https://opensource.org/licenses/MIT',
//       },
//     },
//     servers: [
//       {
//         url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
//         description: 'Local development server',
//       }
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//           description: 'Enter your JWT token in the format **Bearer &lt;token&gt;**',
//         }
//       },
//       schemas: {
//         Client: {
//           type: 'object',
//           properties: {
//             id: { type: 'string', format: 'uuid' },
//             firstName: { type: 'string' },
//             lastName: { type: 'string' },
//             email: { type: 'string', format: 'email' },
//             profileImageUrl: { type: 'string', format: 'url', nullable: true },
//             isVerified: { type: 'boolean' },
//             createdAt: { type: 'string', format: 'date-time' },
//           },
//           required: ['id', 'firstName', 'lastName', 'email', 'isVerified', 'createdAt'],
//         },
//         Provider: {
//           type: 'object',
//           properties: {
//             id: { type: 'string', format: 'uuid' },
//             firstName: { type: 'string' },
//             lastName: { type: 'string' },
//             email: { type: 'string', format: 'email' },
//             specialty: { type: 'string' },
//             bio: { type: 'string' },
//             rating: { type: 'number' },
//             isVerified: { type: 'boolean' },
//             profileImageUrl: { type: 'string', format: 'url', nullable: true },
//             createdAt: { type: 'string', format: 'date-time' },
//           },
//           required: ['id', 'firstName', 'lastName', 'email', 'specialty', 'createdAt'],
//         },
//         Time_Slot: {
//           type: 'object',
//           properties: {
//             id: { type: 'string', format: 'uuid' },
//             provider_id: { type: 'string', format: 'uuid' },
//             day: { type: 'string', format: 'date' },
//             start_time: { type: 'string', format: 'time' },
//             end_time: { type: 'string', format: 'time' },
//             is_booked: { type: 'boolean' },
//             created_at: { type: 'string', format: 'date-time' },
//             updated_at: { type: 'string', format: 'date-time' },
//           },
//           required: ['id', 'provider_id', 'day', 'start_time', 'end_time'],
//         },
//         Appointment: {
//           type: 'object',
//           properties: {
//             id: { type: 'string', format: 'uuid' },
//             provider_id: { type: 'string', format: 'uuid' },
//             client_id: { type: 'string', format: 'uuid' },
//             timeslot_id: { type: 'string', format: 'uuid' },
//             appointment_date: { type: 'string', format: 'date' },
//             status: { type: 'string', enum: ['booked', 'canceled', 'completed'] },
//             created_at: { type: 'string', format: 'date-time' },
//             updated_at: { type: 'string', format: 'date-time' },
//           },
//           required: ['id', 'provider_id', 'client_id', 'timeslot_id', 'appointment_date', 'status'],
//         },
//         Error: {
//           type: 'object',
//           properties: {
//             message: { type: 'string', example: 'An error occurred.' },
//           }
//         }
//       }
//     },
//     security: [
//       {
//         bearerAuth: []
//       }
//     ],
//   },
//   apis: [
//     './routes/auth/*.js',
//     './routes/profile/*.js',
//     './routes/appointments/*.js',
//     './routes/providers/*.js',
//     './routes/timeslots/*.js',
//     './routes/search/*.js'
//   ],
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);

// export default swaggerSpec;
















import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Appointment Booking API',
      version: '1.0.0',
      description: 'A REST API for connecting clients and providersas well as booking appointments for services',
      contact: {
        name: 'API Support',
        // url: 'http://www.example.com/support', // Optional
        // email: 'support@example.com', // Optional
      },
      license: { // Optional
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [ // Add server information
      {
        url: `http://localhost:${process.env.PORT || 3000}/`, // Adjust if your base path differs
        description: 'Development server',
      },
      // Add other servers like staging or production if needed
    ],
    components: { // Define reusable components like security schemes
      securitySchemes: {
        bearerAuth: { // Name of the security scheme
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Format of the token
          description: 'Enter JWT Bearer token **_only_**'
        }
      },
      schemas: { // Define reusable schemas for request/response bodies
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Client ID' },
            firstName: { type: 'string', description: 'Client\'s first name' },
            lastName: { type: 'string', description: 'Client\'s last name' },
            email: { type: 'string', format: 'email', description: 'User\'s email address' },
            profileImageUrl: { type: 'string', format: 'url', nullable: true, description: 'URL of the user\'s profile image' },
            createdAt: { type: 'string', format: 'date-time', description: 'Timestamp of user creation' },
          },
          required: ['id', 'firstName', 'lastName', 'email', 'createdAt']
        },
        Provider: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'Provider ID' },
              firstName: { type: 'string', description: 'Provider\'s first name' },
              lastName: { type: 'string', description: 'Provider\'s last name' },
              email: { type: 'string', format: 'email', description: 'User\'s email address' },
              specialty: {type: 'string', description: 'Provider\'s specific job or service'},
              bio: {type: 'string', description: 'A bio for provider\'s to showcase themselves through words'},
              rating: {type: 'number', description: 'Provider\'s app rating'},
              createdAt: { type: 'string', format: 'date-time', description: 'Timestamp of user creation' },
            },
            required: ['id', 'firstName', 'lastName', 'email', 'specialty', 'createdAt']
          },
        Time_Slot: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Task ID' },
            provider_id: { type: 'string', format: 'uuid', description: 'ID of the provider who owns the slot' },
            day: { type: 'date', format: 'date', nullable: false, description: 'Date of the available work time slot (YYYY-MM-DD)' },
            start_time: { type: 'time', format: 'time', nullable: false, description: 'Start time of the available work time slot (HH:mm)' },
            end_time: { type: 'time', format: 'time', default: false, description: 'End time of the available work time slot (HH:mm)' },
            is_booked: { type: 'boolean', description: 'Condition of a time slot (either booked or not)' },
            created_at: { type: 'string', format: 'date-time', description: 'Timestamp of task creation' },
            updated_at: { type: 'string', format: 'date-time', description: 'Timestamp of last task update' },
          },
          required: ['id', 'provider_id', 'day', 'end_time', 'created_at', 'updated_at']
        },
        Appointment: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'Task ID' },
              provider_id: { type: 'string', format: 'uuid', description: 'ID of the provider who was booked' },
              client_id: { type: 'string', format: 'uuid', description: 'ID of the client who booked the appointment' },
              timeslot_id: { type: 'string', format: 'uuid', description: 'ID of the time slot that has been booked' },
              appointment_date: { type: 'date', format: 'date', description: 'Date of theappointment(YYYY-MM-DD)' },
              status: { type: 'string', format: 'option', description: 'State of the current booking' },
              created_at: { type: 'string', format: 'date-time', description: 'Timestamp of task creation' },
              updated_at: { type: 'string', format: 'date-time', description: 'Timestamp of last task update' },
            },
            required: ['id', 'provider_id', 'client_id', 'timeslot_id', 'created_at', 'updated_at']
          },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message' },
          }
        }
      }
    },
    security: [ // Apply security globally (can be overridden per operation)
      {
        bearerAuth: [] // Requires bearerAuth for all routes unless specified otherwise
      }
    ]
  },
  // Path to the API docs files that contain OpenAPI annotations
  apis: ['./routes/*.js'], // Looks for JSDoc comments in all .js files in the routes directory
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec; 
