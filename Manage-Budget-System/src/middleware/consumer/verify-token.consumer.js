import jwt from "jsonwebtoken";
import { consumer } from "../../configurations/docker/kafka.configuration.js";
import { handleFailedResponse } from "../../utils/response-handling/failed-response/handle.failed-response.js";
import { handleErrorResponse } from "../../utils/response-handling/error-response/handle.error-response.js";


async function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return handleFailedResponse(res, "Invalid Token", 401);
  }

  try {
    console.info("Attempting to connect to Kafka");
    await consumer.connect();
    console.info("Connected to Kafka");

    await consumer.subscribe({ topic: "token-verification", fromBeginning: false });
    await consumer.run({

      eachMessage: async ({ topic, partition, message }) => {
        const { token: receivedToken } = JSON.parse(message.value.toString());

        jwt.verify(receivedToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
          if (err) {
            console.error("Token verification failed", err);
            handleErrorResponse(res, err);
          } else {
            req.accountId = decode.accountId;
            console.log("Token verified", decode);
            next();
          }
        });
      },
    });
  } catch (err) {
    await consumer.disconnect();
    return handleErrorResponse(res, err);
  }
}

export default verifyToken;
