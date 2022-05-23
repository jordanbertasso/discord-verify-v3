import { Schema, model, connect } from 'mongoose';
import config from '../config';

interface IAttempt {
  email: string;
  date: Date;
}

interface IUser {
  discordId: string;
  email: string;
  isStaff: boolean;
  verified: boolean;
  dateVerified: Date;
  attempts: IAttempt[];
}

const AttemptSchema = new Schema<IAttempt>({
  email: String,
  date: Date,
});

const UserSchema = new Schema<IUser>({
  discordId: { type: String, required: true },
  email: String,
  isStaff: String,
  verified: { type: Boolean, required: true },
  dateVerified: Date,
  attempts: [AttemptSchema],
});

const User = model<IUser>('User', UserSchema);

const connectToDB = async () => {
  await connect(
    `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
    {
      user: 'root',
      pass: config.db.password,
      authSource: 'admin',
    },
  );
};

export const addAttempt = async (email: string, discordId: string) => {
  let user = await User.findOne({ discordId });

  if (!user) {
    user = new User({
      discordId,
      verified: false,
    });
  }

  const attempt = {
    email,
    date: new Date(),
  };

  user.attempts.push(attempt);

  await user.save();
};

export const attemptsForUser = async (userId: string, lastHours: number) => {
  const user = await User.findOne({ discordId: userId });

  if (!user) {
    return 0;
  }

  return user.attempts.filter((attempt) => {
    const date = new Date(attempt.date);

    const lookbackTime = Date.now() - lastHours * 60 * 60 * 1000;

    return date.getTime() > lookbackTime;
  }).length;
};

export const getUser = async (discordId: string) => {
  return await User.findOne({ discordId });
};

export const addVerifiedUserToDb = async (
  discordId: string,
  email: string,
  staff: boolean,
) => {
  const user = new User({
    discordId,
    email,
    isStaff: staff,
    verified: true,
    dateVerified: new Date(),
  });

  // Check if user already verified
  try {
    const existingDiscordUser = await User.findOne({ discordId });
    if (existingDiscordUser?.verified) {
      throw new Error('User already verified');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }

  // Check if email already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already used');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }


  console.log(`Saving user ${discordId} - ${email}`);

  try {
    await user.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default connectToDB;
