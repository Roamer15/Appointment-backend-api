import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import winstonLogger from './utils/logger.js'
import morgan from 'morgan'
import swaggerUi from "swagger-ui-express"
import swaggerSpec from './swaggerConfig.js'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import timeslotRouter from './routes/timeslots.js'
import searchRouter from './routes/search.js'
import appointmentRouter from './routes/appointment.js'
import profileRouter from './routes/account.js'

const app = express();

const morganFormat = process.env.NODE_ENV === "production" ? "dev" : 'combined'
app.use(morgan(morganFormat, { stream: winstonLogger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter)
app.use('/timeslots', timeslotRouter)
app.use('/search', searchRouter)
app.use('/appointment', appointmentRouter)
app.use('/profile', profileRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


export default app