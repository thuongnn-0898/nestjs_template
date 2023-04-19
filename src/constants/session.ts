import { CookieOptions } from 'express-session';

export const sessionConfig = {
  secret: process.env.SESSION_PRIVATE_KEY,
};

export const cookieOption = {
  httpOnly: true,
  // maxAge: 0,
  // domain: ''
} as CookieOptions;
