import { config } from 'dotenv';
config(); 

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger/doc/swagger.json';
import ServerResponse from './utils/ServerResponse';
import router from './routes';
import morganLogger from './loggers/logger';
import startParkingSlotAvailabilityJob  from './utils/parkingSlotAvailabilityJob';

console.log('Loaded env PORT:', process.env.PORT);
console.log('Loaded env DATABASE_URL:', process.env.DATABASE_URL);

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 7070

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))  

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both Vite and React default ports
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(morganLogger)
app.disable('x-powered-by');

app.use('/api', router)
// @ts-ignore: Unreachable code error
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use("*", (req, res) => {
    return ServerResponse.error(res, "Route not found")
})

//run app scheduler to update parking slot availability
startParkingSlotAvailabilityJob()

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})