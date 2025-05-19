// src/middleware/morganLogger.ts
import morgan from "morgan";

// Add a custom timestamp token
morgan.token("timestamp", () => new Date().toISOString());

// Define custom format
const customFormat = "[:timestamp] :method :url :status - :response-time ms";
const morganLogger = morgan(customFormat);
console.log("Morgan logger initialized with timestamped format 🚀");

export default morganLogger;


//this logs details about each web request with a time stamp to help track what’s happening.