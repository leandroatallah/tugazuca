import "dotenv/config";
import app from "./server.js";

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
