import bcrypt from "bcryptjs";
import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import config from "../configs/app";

// Define what the service needs to function
// interface UsersServiceDeps {
// }

export const createAuthService = () => {
  return {
    comparePassword: (plainText: string, hash: string) => {
      return bcrypt.compareSync(plainText, hash);
    },
    signAccessToken(payload: object) {
      const options: SignOptions = { expiresIn: config.jwt_access_token_expiration as SignOptions["expiresIn"] };
      return jwt.sign(payload as string | object | Buffer, config.jwt_secret as Secret, options);
    },

    verifyAccessToken(token: string) {
      try {
        return jwt.verify(token, config.jwt_secret);
      } catch (_error) {
        return null;
      }
    }
  };
};
