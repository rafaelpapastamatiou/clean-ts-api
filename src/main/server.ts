import { MongoHelper } from "../infra/database/mongodb/helpers/mongo-helper";
import { env } from "./env";

(async () => {
  try {
    await MongoHelper.connect(env.mongoUrl);

    const { app } = await import("./app");

    app.listen(env.port, () =>
      console.log(`Server running at http://localhost:${env.port.toString()}`)
    );
  } catch (err) {
    console.error(err);
  }
})();
