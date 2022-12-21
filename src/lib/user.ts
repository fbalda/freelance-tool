import { SettingsData } from "@components/forms/settingsForm";
import { UserData } from "@prisma/client";
import crypto from "crypto";
import { authenticator } from "otplib";
import prisma from "./db";

const createPasswordHashAndSalt = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const pwhash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return {
    pwhash,
    salt,
  };
};

export const createUser = async (data: SettingsData) => {
  if (
    await prisma.userData.findUnique({ where: { username: data.username } })
  ) {
    // User already exists
    // TODO: Display error messages
    return undefined;
  }

  const { password, ...dbData } = data;

  // Here you should create the user and save the salt and hashed password
  const { pwhash, salt } = createPasswordHashAndSalt(password);

  const date = new Date();

  await prisma.userData.create({
    data: {
      ...dbData,
      pwhash,
      salt,
      createdAt: date,
    },
  });

  return { username: data.username, createdAt: date };
};

export const updateSettings = async (
  userId: string,
  data: Partial<SettingsData>
) => {
  const { currentPassword, password, ...updateData } = data;

  let pwhashAndSalt: { pwhash: string; salt: string } | undefined = undefined;

  if (currentPassword && password) {
    const user = await prisma.userData.findUnique({ where: { id: userId } });

    if (!user) {
      // This should never happen
      throw new Error("Unknown user");
    }

    if (!validatePassword(user, currentPassword)) {
      throw new Error("Invalid password");
    }

    pwhashAndSalt = createPasswordHashAndSalt(password);
  }

  await prisma.userData.update({
    where: { id: userId },
    data: { ...updateData, ...pwhashAndSalt },
  });
};

export const getUserByUsername = async (username: string) => {
  return prisma.userData.findUnique({ where: { username } });
};

export const getUserById = async (id: string) => {
  return prisma.userData.findUnique({ where: { id } });
};

export const validatePassword = (user: UserData, inputPassword: string) => {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, "sha512")
    .toString("hex");
  const passwordsMatch = user.pwhash === inputHash;
  return passwordsMatch;
};

export const validateTotp = (user: UserData, token: string) => {
  if (!user.totpsecret) {
    // User doesn't use TOTP
    return true;
  }
  return authenticator.verify({ token, secret: user.totpsecret });
};
