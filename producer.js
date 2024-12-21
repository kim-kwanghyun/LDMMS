const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'] // Kafka 브로커 주소
});

const producer = kafka.producer();

const run = async () => {
  // 프로듀서 연결
  await producer.connect();

  // 메시지 보내기
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello Kafka!' },
    ],
  });

  console.log("Message sent successfully!");

  // 연결 종료
  await producer.disconnect();
};

run().catch(console.error);