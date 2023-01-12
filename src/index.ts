import { createServer } from "http";

import * as dotenv from 'dotenv';
import { requestListener } from "./users/users.controller";
import { InMemoryDatabase, User } from "./users/users.model";
dotenv.config();

const port = process.env.PORT;

const server = createServer(requestListener);
server.listen(port, () => {});
