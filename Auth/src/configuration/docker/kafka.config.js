import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth",
  brokers: ["localhost:9092"],
  // brokers: ["kafka:9092"],
  // brokers: ["172.18.0.3:9092"],
});

const producer = kafka.producer();

export { producer };
