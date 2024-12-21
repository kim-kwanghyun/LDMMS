const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'] // Kafka 브로커 주소
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  // 컨슈머 연결
  await consumer.connect();

  // 특정 토픽 구독
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  // 메시지 수신 처리
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

run().catch(console.error);
