import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/helper/server-side/validator";
import { signinSchema } from "@/helper/server-side/validator";

const allowedFields = ["email", "firstName", "lastName", "_id"];
const UserSchema = new mongoose.Schema(
  {
    accountStatus: {
      type: Number,
      enum: [0, 1, 2, 3], //0 unverified 1 email verified 2 suspended 3 banned
      default: 0,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 64,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 250,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    avatar: {
      type: String,
      default: null,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    suspendedTill: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        Object.keys(ret).forEach((key) => {
          if (!allowedFields.includes(key)) {
            delete ret[key];
          }
        });
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        Object.keys(ret).forEach((key) => {
          if (!allowedFields.includes(key)) {
            delete ret[key];
          }
        });
        return ret;
      },
    },
  }
);

// Add index for suspended/attempt-based queries (optional)

//pre save middleware
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(
        this.password,
        await bcrypt.genSalt(10)
      );
    }
    next();
  } catch (err) {
    next(err);
  }
});

//static method signup
UserSchema.statics.signup = async function (signupData) {
  class SignupError extends Error {
    constructor(message) {
      super(message);
      this.name = "SignupError";
    }
  }
  const parsedData = await signupSchema.safeParseAsync(signupData);
  if (!parsedData.success) {
    throw new SignupError("Invalid input");
  }
  const { email, password, firstName, lastName } = parsedData.data;

  const user = await this.findOne({ email });

  //ifUser
  if (user) {
    throw new SignupError("Email is already registered");
  }

  return await this.create({ email, password, firstName, lastName });
  //
};

//static method signin
UserSchema.statics.signin = async function (signinData) {
  class SigninError extends Error {
    constructor(path, message, suspendedTill, email) {
      super(message);
      this.name = "SigninError";
      this.path = path;
      this.suspendedTill = suspendedTill;
      this.email = email;
    }
  }
  const parsedData = await signinSchema.safeParseAsync(signinData);
  if (!parsedData.success) {
    throw new SigninError("email", "Invalid input");
  }

  const { email, password } = parsedData.data;
  const user = await this.findOne({ email });

  if (!user) {
    throw new SigninError("email", "Email is not registered");
  }

  if (user.accountStatus === 3) {
    throw new SigninError("email", "This account is permanently banned");
  }

  if (
    user.accountStatus === 2 &&
    user.suspendedTill &&
    new Date() < user.suspendedTill
  ) {
    const msRemaining = user.suspendedTill - new Date();
    const mins = Math.floor(msRemaining / 60000);
    const secs = Math.floor((msRemaining % 60000) / 1000);

    throw new SigninError(
      "password",
      `Too many attempts. Try again in ${mins} minute(s) and ${secs} second(s).`,
      user.suspendedTill,
      user.email
      // "Too many attempts. Try again later"
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    user.lastLoginAt = new Date();
    user.loginAttempts = 0;
    user.suspendedTill = null;
    user.accountStatus = 1;
    await user.save();
    return user;
  }

  // Handle failed login
  user.loginAttempts = user.loginAttempts + 1;

  if (user.loginAttempts >= 10) {
    user.accountStatus = 3;
    await user.save();
    throw new SigninError(
      "email",
      "You tried too many times. Your account is permanently banned."
    );
  }

  if (user.loginAttempts === 3) {
    user.accountStatus = 2;
    //   user.suspendedTill = new Date(Date.now() + 5 * 60 * 1000);
    user.suspendedTill = new Date(Date.now() + 10 * 1000);
    await user.save();
  }
  if (user.loginAttempts === 5) {
    user.accountStatus = 2;
    //   user.suspendedTill = new Date(Date.now() + 25 * 60 * 1000);
    user.suspendedTill = new Date(Date.now() + 20 * 1000);
    await user.save();
  } // 20 minutes
  if (user.loginAttempts === 7) {
    user.accountStatus = 2;
    //   user.suspendedTill = new Date(Date.now() + 1 * 60 * 60 * 1000);
    user.suspendedTill = new Date(Date.now() + 30 * 1000);

    await user.save();
  }
  if (user.loginAttempts === 9) {
    user.accountStatus = 2;
    //  user.suspendedTill = new Date(Date.now() + 6 * 60 * 60 * 1000);
    user.suspendedTill = new Date(Date.now() + 40 * 1000);

    await user.save();
  }
  await user.save();
  throw new SigninError("password", "Invalid password");
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
