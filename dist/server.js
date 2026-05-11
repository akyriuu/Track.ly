"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
require("dotenv/config");
const auth_1 = require("./routes/auth");
const lastfm_1 = require("./routes/lastfm");
const static_1 = __importDefault(require("@fastify/static"));
const path_1 = __importDefault(require("path"));
const app = (0, fastify_1.default)({ logger: true });
app.register(cors_1.default, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
});
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET,
});
app.register(static_1.default, {
    root: path_1.default.join(path_1.default.resolve(), "public"),
});
app.register(auth_1.authRoutes);
app.register(lastfm_1.lastfmRoutes);
app.get("/health", async () => {
    return { status: "ok" };
});
const start = async () => {
    try {
        await app.listen({
            port: Number(process.env.PORT) || 2004,
            host: "0.0.0.0",
        });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
