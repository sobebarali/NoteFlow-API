export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'yourSecretKey',
  expiresIn: '1h',
};
