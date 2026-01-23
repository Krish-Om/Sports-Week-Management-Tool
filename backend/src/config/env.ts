import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  DATABASE_URL: string;
  JWT_SECRET: string;
  PORT: number;
  NODE_ENV: string;
  FRONTEND_URL: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  PORT: parseInt(getEnvVar('PORT', '3001'), 10),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:5173'),
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
