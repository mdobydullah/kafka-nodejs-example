import { Kafka, logLevel } from 'kafkajs';

import dotenv from 'dotenv';
dotenv.config();

const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
      mechanism: 'scram-sha-256',
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD
  },
  logLevel: logLevel.ERROR,
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  await producer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [
      { value: 'Hello Kafka!' },
      ],
  });

  console.log("Message sent successfully");
  await producer.disconnect();
};

run().catch(e => console.error('[example/producer] e.message', e));