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

const consumer = kafka.consumer({ groupId: 'YOUR_CONSUMER_GROUP' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

run().catch(e => console.error('[example/consumer] e.message', e));