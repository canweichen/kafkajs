const { Kafka } = require('kafkajs');

// Create a new Kafka client instance
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['172.18.0.3:9091'] // replace with your Kafka broker address
});

// Create a new producer instance
const producer = kafka.producer();

// Connect to the Kafka cluster
producer.connect().then(() => {
  console.log('Producer connected');

  // Send a message to the `my-topic` topic
  producer.send({
    topic: 'demo', // replace with your Kafka topic
    messages: [{
      value: 'Hello, Kafka!'
    }]
  }).then(() => {
    console.log('Message sent');

    // Close the producer connection
    producer.disconnect();
  });
});

// Create a new consumer instance
const consumer = kafka.consumer({
  groupId: 'my-group' // replace with your consumer group ID
});

// Connect to the Kafka cluster
consumer.connect().then(() => {
  console.log('Consumer connected');

  // Subscribe to the `my-topic` topic
  consumer.subscribe({
    topic: 'demo',
    fromBeginning: true
  });

  // Consume messages from the topic
  consumer.run({
    eachMessage: ({ message }) => {
      console.log(`Received message: ${message.value.toString()}`);
    }
  });
});