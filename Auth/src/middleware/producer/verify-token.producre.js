import { handleFailedResponse } from "../../utils/response-handling/failed-response/handle.failed-response.js";
import { handleErrorResponse } from "../../utils/response-handling/error-response/handle.error-response.js";
import { producer } from "../../configuration/docker/kafka.config.js";

async function verifyTokenWithKafka(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return handleFailedResponse(res, "Invalid Token", 401);
  }

  try {
    await producer.connect();
    console.info("producer manggil")
    await producer.send({
      topic: "token-verification",
      messages: [
        {
          value: JSON.stringify({ token }),
        },
      ],
    });

    next();
  } catch (err) {
    return handleErrorResponse(res, err);
  } finally {
    await producer.disconnect();
  }
}

export { verifyTokenWithKafka };
