"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const authenticate_1 = require("../plugins/authenticate");
const lastfm_1 = require("../services/lastfm");
async function authRoutes(app) {
    app.post("/auth/register", async (request, reply) => {
        const { username, password, lastfmUsername } = request.body;
        const existing = await prisma_1.default.user.findUnique({ where: { username } });
        if (existing) {
            return reply.status(400).send({ error: "Username already taken" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: { username, password: hashed, lastfmUsername },
        });
        const token = app.jwt.sign({ id: user.id, username: user.username }, { expiresIn: "1d" });
        return reply.status(201).send({ token });
    });
    app.post("/auth/login", async (request, reply) => {
        const { username, password } = request.body;
        const user = await prisma_1.default.user.findUnique({ where: { username } });
        if (!user) {
            return reply.status(401).send({ error: "Invalid username" });
        }
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid) {
            return reply.status(401).send({ error: "Invalid password" });
        }
        const token = app.jwt.sign({ id: user.id, username: user.username }, { expiresIn: "1d" });
        return reply.send({ token });
    });
    app.get("/me", { preHandler: authenticate_1.authenticate }, async (request, reply) => {
        const payload = request.user;
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                username: true,
                lastfmUsername: true,
                createdAt: true,
            },
        });
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }
        return reply.send(user);
    });
    app.get("/me/now-playing", { preHandler: authenticate_1.authenticate }, async (request, reply) => {
        const payload = request.user;
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.id },
            select: { lastfmUsername: true },
        });
        if (!user?.lastfmUsername) {
            return reply.status(400).send({ error: "Last.fm username not set" });
        }
        try {
            const data = await (0, lastfm_1.getNowPlaying)(user.lastfmUsername);
            return reply.send(data);
        }
        catch (err) {
            return reply.status(500).send({ error: "Failed to fetch now playing" });
        }
    });
    app.get("/me/stats", { preHandler: authenticate_1.authenticate }, async (request, reply) => {
        const payload = request.user;
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.id },
            select: { lastfmUsername: true },
        });
        if (!user?.lastfmUsername) {
            return reply.status(400).send({ error: "No username configured" });
        }
        try {
            const [info, topArtists, topTracks] = await Promise.all([
                (0, lastfm_1.getUserInfo)(user.lastfmUsername),
                (0, lastfm_1.getTopArtists)(user.lastfmUsername),
                (0, lastfm_1.getTopTracks)(user.lastfmUsername),
            ]);
            return reply.send({ info, topArtists, topTracks });
        }
        catch (err) {
            console.log(err);
            return reply.status(500).send({ error: "Failed to get stats" });
        }
    });
    app.patch("/me", { preHandler: authenticate_1.authenticate }, async (request, reply) => {
        const payload = request.user;
        const { lastfmUsername } = request.body;
        if (!lastfmUsername) {
            return reply
                .status(400)
                .send({ error: "lastfmUsername é obrigatório" });
        }
        const check = await (0, lastfm_1.getUserInfo)(lastfmUsername).catch(() => null);
        if (!check) {
            return reply.status(400).send({ error: "Invalid Last.fm username" });
        }
        const user = await prisma_1.default.user.update({
            where: { id: payload.id },
            data: { lastfmUsername },
            select: {
                id: true,
                username: true,
                lastfmUsername: true,
                createdAt: true,
            },
        });
        return reply.send(user);
    });
}
