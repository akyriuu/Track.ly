import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { getNowPlaying, getUserInfo } from "../services/lastfm";

interface UserParams {
  username: string;
}

export async function lastfmRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: UserParams }>(
    "/users/:username/now-playing",
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const { username } = request.params;
        const data = await getNowPlaying(username);
        return reply.send(data);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to find track" });
      }
    },
  );

  app.get<{ Params: UserParams }>(
    "/users/:username/info",
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const { username } = request.params;
        const data = await getUserInfo(username);
        return reply.send(data);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to find user info" });
      }
    },
  );
}
