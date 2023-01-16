import { createServer } from 'http';

import * as dotenv from 'dotenv';
import { requestListener } from './users/users.controller';

dotenv.config();

const port = process.env.PORT;

export const server = createServer(requestListener);
server.listen(port, () => {});
