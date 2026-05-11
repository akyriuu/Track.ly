"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastfmRoutes = lastfmRoutes;
const authenticate_1 = require("../plugins/authenticate");
const lastfm_1 = require("../services/lastfm");
async function lastfmRoutes(app) {
    app.get("/users/:username/now-playing", { preHandler: authenticate_1.authenticate }, async (request, reply) => {
        console.log("hit now-playing route");
        try {
            const { username } = request.params;
            console.log("username:", username);
            const data = await (0, lastfm_1.getNowPlaying)(username);
            console.log("data:", data);
            return reply.send(data);
        }
        catch (err) {
            console.log("error:", err);
            return reply.status(500).send({ error: "Failed to find track" });
        }
    });
    app.get("/users/:username/info", { preHandler: authenticate_1.authenticate }, async (request, reply) => {
        try {
            const { username } = request.params;
            const data = await (0, lastfm_1.getUserInfo)(username);
            return reply.send(data);
        }
        catch (err) {
            console.log(err);
            return reply.status(500).send({ error: "Failed  to find user info" });
        }
    });
}
