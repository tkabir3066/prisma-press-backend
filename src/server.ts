import app from "./app";
import "dotenv/config";
import { prisma } from "./lib/prisma";
import config from "./config";

const port = config.port;
const main = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server is running port: ${port}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
