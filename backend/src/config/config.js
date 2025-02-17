import dotenv from "dotenv";
import joi from "joi";

dotenv.config({ path: ".env" });

const envVarsSchema = joi
    .object({
        PORT: joi.number().default(3000),
        MONGODB_URI: joi.string().description("Mongo DB url"),
        CORS_ORIGIN: joi.string().description("CORS origin"),
        ACCESS_TOKEN_SECRET_KEY: joi
            .string()
            .description("JWT secret key"),
        ACCESS_TOKEN_EXPIRY: joi
            .string()
            .description("JWT expiration time"),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URI,
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    cors: {
        origin: envVars.CORS_ORIGIN,
    },
    jwt: {
        secret: envVars.ACCESS_TOKEN_SECRET_KEY,
        expiry: envVars.ACCESS_TOKEN_EXPIRY,
    },
};
