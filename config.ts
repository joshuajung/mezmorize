import { config } from "dotenv";

export const getConfig = () => {
  config();
  return {
    port: process.env.PORT ?? 3000,
    mezmoKey: process.env.MEZMO_KEY!,
    workingDir: process.env.WORKING_DIR ?? "working",
  };
};
