import "dotenv/config";
import app from "./server.js";
import logger from "./services/logger.js";

const port = 3000;

app.listen(port, () => {
  logger.info(`App listening on port ${port}`);
});
