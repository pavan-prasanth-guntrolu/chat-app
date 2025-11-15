import mongoose, { Document, Schema } from "mongoose";

interface IChat extends Document {
  users: string[];
  latestMessage: {
    text: string;
    sender: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const schema: Schema<IChat> = new Schema(
  {
    users: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          // must be an array of exactly two distinct user ids
          if (!Array.isArray(v)) return false;
          if (v.length !== 2) return false;
          return new Set(v.map(String)).size === 2;
        },
        message: "users must be an array of two distinct user ids",
      },
    },
    latestMessage: {
      text: String,
      sender: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model<IChat>("Chat", schema);
