import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const startSendOtpConsumer = async function () {
  try {
    // const connection = await amqp.connect({
    //   protocol: "amqp",
    //   hostname: process.env.RABBITMQ_HOST,
    //   port: 5672,
    //   username: process.env.RABBITMQ_USERNAME,
    //   password: process.env.RABBITMQ_PASSWORD,
    // });
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "");
    const channel = await connection.createChannel();
    await channel.assertQueue("send-otp", { durable: true });
    console.log("✅ Mail service consumer started,listening for otp emails");
    const queueName = "send-otp";
    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const { to, subject, body } = JSON.parse(msg.content.toString());
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, // <--- CHANGE: Use Secure Port
            secure: true, // <--- CHANGE: Must be true for 465
            pool: true,
            maxConnections: 1,
            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            },
            tls: {
              // Helps prevent handshake hanging
              ciphers: "SSLv3",
            },
            // Force IPv4 (Fixes many cloud timeout issues)
            family: 4,
            // Increase timeouts further
            connectionTimeout: 30000,
            greetingTimeout: 30000,
          });
          await transporter.sendMail({
            from: "Chat App",
            to,
            subject,
            text: body,
          });
          console.log("otp mail sent to" + to);
          channel.ack(msg);
        } catch (error) {
          console.log("Failed to send otp", error);
        }
      }
    });
  } catch (error) {
    console.log("Failed to start rabbitmq consumer", error);
  }
};
