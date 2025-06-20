import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/helper/server-side-validator/validator";
import { signinSchema } from "@/helper/server-side-validator/validator";

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
  try {
    const parsedData = await signupSchema.safeParseAsync(signupData);
    if (!parsedData.success) {
      throw new Error("Invalid input");
    }
    const { email, password, firstName, lastName } = parsedData.data;

    const user = await this.findOne({ email });

    //ifUser
    if (user) {
      throw new Error("Email is registered");
    }

    return await this.create({ email, password, firstName, lastName });
    //
  } catch (err) {
    throw err;
  }
};

//static method signin
UserSchema.statics.signin = async function (signinData) {
  const parsedData = await signinSchema.safeParseAsync(signinData);
  if (!parsedData.success) {
    throw new Error("Invalid input");
  }

  const { email, password } = parsedData.data;
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Email is not registered");
  }

  if (user.accountStatus === 3) {
    throw new Error("This account is permanently banned");
  }

  if (
    user.accountStatus === 2 &&
    user.suspendedTill &&
    new Date() < user.suspendedTill
  ) {
    // const msRemaining = user.suspendedTill - new Date();
    // const mins = Math.floor(msRemaining / 60000);
    // const secs = Math.floor((msRemaining % 60000) / 1000);

    throw new Error(
      // `Too many attempts. Try again in ${mins} minute(s) and ${secs} second(s).`
      "Too many attempts. Try again later"
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
    throw new Error(
      "You tried too many times. Your account is permanently banned."
    );
  }

  if (user.loginAttempts === 3) {
    user.accountStatus = 2;
    user.suspendedTill = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
  }
  if (user.loginAttempts === 5) {
    user.accountStatus = 2;
    user.suspendedTill = new Date(Date.now() + 25 * 60 * 1000);
    await user.save();
  } // 20 minutes
  if (user.loginAttempts === 7) {
    user.accountStatus = 2;
    user.suspendedTill = new Date(Date.now() + 1 * 60 * 60 * 1000);
    await user.save();
  }
  if (user.loginAttempts === 9) {
    user.accountStatus = 2;
    user.suspendedTill = new Date(Date.now() + 6 * 60 * 60 * 1000);
    await user.save();
  }
  await user.save();
  throw new Error("Invalid password");
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
