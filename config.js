import dotenv from 'dotenv'

const config = dotenv.config() // parse .env file contents into process.env object

console.log("Loaded env config: ", config)

export const env = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  MONGO_URI: process.env.MONGO_URI
}