import Fastify from "fastify";
import jwt from "@fastify/jwt";
import "dotenv/config";
import { authRoutes } from "./routes/auth";
import { lastfmRoutes } from "./routes/lastfm";
import fastifyStatic from "@fastify/static";
import path from "path";

const app = Fastify({ logger: true });
app.register(jwt, {
  secret: process.env.JWT_SECRET as string,
});

app.register(fastifyStatic, {
  root: path.join(path.resolve(), "public"),
});

app.register(authRoutes);
app.register(lastfmRoutes);

app.get("/health", async () => {
  return { status: "ok" };
});

const start = async (): Promise<void> => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 2004 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
