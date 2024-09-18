import { cleanEnv, str, email, json,num } from "envalid";

const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: "dev" }),
  PORT: num({ default: 4000 }),
  DATABASE_HOST_NAME: str({ default: "mysql" }),
  DATABASE_USER_NAME: str({ default: "root" }),
  DATABASE_USER_PASSWORD: str({ default: "root" }),
  SERVICE_DATABASE_NAME: str({ default: "usersDb" }),
//   PRODUCT_SERVICE_DATABASE_NAME:str(),
//   PRODUCT_DATABASE_USER_NAME:str(),
//   PRODUCT_DATABASE_USER_PASSWORD:str(),
  TOKEN_SECRET: str({default:'7ef521015a24ccf37363fedaf978bd2b7845b47e6c8301d91e866ae474726b8296aba5040e42773c3bd17c0f77971fd7a43488e8f7a994e297bad95d746b4d9d'}),
//   AWS_S3_REGION: str(),
//   AWS_S3_ACCESS_KEY_ID: str(),
//   AWS_S3_SECRET_ACCESS_KEY: str(),
//   AWS_S3_BUCKET_NAME:str()
});


export default env;