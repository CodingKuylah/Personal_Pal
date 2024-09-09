import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "mbs",
  // brokers: ['172.23.0.3:9092'],
  brokers: ['kafka:9092'],
  // brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "mbs-group", maxBytesPerPartition: 200000000 });

export { consumer };
