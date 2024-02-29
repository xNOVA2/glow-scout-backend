export const ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user', // request initiator
  BUSINESS: 'business',
});
export const LOGIN_TYPES = Object.freeze({
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  FACEBOOK: 'FACEBOOK',
  GOOGLE: 'GOOGLE',
});
export const STATUS_CODES = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});