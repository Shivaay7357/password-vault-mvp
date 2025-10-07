export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const REQUIRED_SERVER_ENVS = [
  'MONGODB_URI',
  'JWT_SECRET',
];

export const REQUIRED_PUBLIC_ENVS = [
  'NEXT_PUBLIC_CRYPTO_KEY',
];

export function validateEnv(): void {
  [...REQUIRED_SERVER_ENVS, ...REQUIRED_PUBLIC_ENVS].forEach(requireEnv);
}



