import jwt from 'jsonwebtoken';

const generateToken = (id, rememberMe = false) => {
  const expiresIn = rememberMe ? '30d' : '1d';
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_token_for_creatorsync_2026_dev', {
    expiresIn
  });
};

export default generateToken;
