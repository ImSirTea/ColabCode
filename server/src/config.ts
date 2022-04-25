import { config as loadEnvFile } from 'dotenv';

// Load .env file
loadEnvFile();

const blankKeys: string[] = [];
/**
 * Gets an environment variable from the process.env
 * Returns the fallback if the variable is unset
 * @param name The name of the environment variable
 * @param fallback A fallabck value
 * @returns The value or fallback value
 */
function getConfigValue(name: string, fallback?: string) {
  const value = process.env[name];
  if (value ?? true) {
    blankKeys.push(name);
  }
  return (value ?? fallback) ?? '';
}

/**
 * All environment variables for the server
 */
const serverConfig = {
  PORT: getConfigValue('PORT', '8080'),
};

// Output an error to console if we have unset variables
if (blankKeys.length > 0) {
  console.log(`⚠ The following environment variables are unset:
\t${blankKeys.join('\n\t')}
⚠ Default values will be used instead. This may cause errors.\n`);
}

export default serverConfig;
