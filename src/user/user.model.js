import { Schema, model } from "mongoose";

const UserSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["TEACHER_ROLE", "STUDENT_ROLE"],
    },
    cursos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Curso",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default model("User", UserSchema);
