import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";
import {
  getNowPlaying,
  getUserInfo,
  getTopArtists,
  getTopTracks,
} from "../services/lastfm";

interface RegisterBody {
  username: string;
  password: string;
  lastfmUsername?: string;
}

interface loginBody {
  username: string;
  password: string;
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: RegisterBody }>("/auth/register", async (request, reply) => {
    const { username, password, lastfmUsername } = request.body;
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return reply.status(400).send({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashed, lastfmUsername },
    });

    const token = app.jwt.sign(
      { id: user.id, username: user.username },
      { expiresIn: "1d" },
    );
    return reply.status(201).send({ token });
  });

  app.post<{ Body: loginBody }>("/auth/login", async (request, reply) => {
    const { username, password } = request.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return reply.status(401).send({ error: "Invalid username" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return reply.status(401).send({ error: "Invalid password" });
    }

    const token = app.jwt.sign(
      { id: user.id, username: user.username },
      { expiresIn: "1d" },
    );
    return reply.send({ token });
  });

  app.get("/me", { preHandler: authenticate }, async (request, reply) => {
    const payload = request.user as { id: string; username: string };

    const user = await prisma.user.findUnique({
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

  app.get(
    "/me/now-playing",
    { preHandler: authenticate },
    async (request, reply) => {
      const payload = request.user as { id: string; username: string };

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { lastfmUsername: true },
      });

      if (!user?.lastfmUsername) {
        return reply.status(400).send({ error: "Last.fm username not set" });
      }

      try {
        const data = await getNowPlaying(user.lastfmUsername);
        return reply.send(data);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to fetch now playing" });
      }
    },
  );
  app.get("/me/stats", { preHandler: authenticate }, async (request, reply) => {
    const payload = request.user as { id: string; username: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { lastfmUsername: true },
    });

    if (!user?.lastfmUsername) {
      return reply.status(400).send({ error: "No username configured" });
    }
    try {
      const [info, topArtists, topTracks] = await Promise.all([
        getUserInfo(user.lastfmUsername),
        getTopArtists(user.lastfmUsername),
        getTopTracks(user.lastfmUsername),
      ]);

      return reply.send({ info, topArtists, topTracks });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({ error: "Failed to get stats" });
    }
  });

  app.patch<{ Body: { lastfmUsername: string } }>(
    "/me",
    { preHandler: authenticate },
    async (request, reply) => {
      const payload = request.user as { id: string; username: string };
      const { lastfmUsername } = request.body;

      if (!lastfmUsername) {
        return reply
          .status(400)
          .send({ error: "lastfmUsername é obrigatório" });
      }

      const check = await getUserInfo(lastfmUsername).catch(() => null);
      if (!check) {
        return reply.status(400).send({ error: "Invalid Last.fm username" });
      }

      const user = await prisma.user.update({
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
    },
  );
}
