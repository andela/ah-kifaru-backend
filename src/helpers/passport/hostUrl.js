import { config } from 'dotenv';

config();
let hostUrl;

if (process.env.NODE_ENV === 'production') {
  hostUrl = process.env.BASE_URL;
} else {
  hostUrl = process.env.LOCAL_URL;
}
export default hostUrl;
