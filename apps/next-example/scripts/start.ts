import cli from "next/dist/cli/next-start";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

cli.nextStart({
  port,
  hostname: process.env.HOSTNAME || "0.0.0.0",
});
