//whitelist is an array of allowed origins
const whitelist = [
    "http://localhost:7070",
];
const options = {
    origin: (origin: string, callback: Function) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    credentials: true,
};

export default options;