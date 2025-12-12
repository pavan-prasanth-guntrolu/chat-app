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
            pool: true,
            maxConnections: 1,
            port: 587,
            secure: false,
            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            },
            logger: true,
            debug: true,
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000,
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
