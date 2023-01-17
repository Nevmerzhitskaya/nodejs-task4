
import { IncomingMessage, ServerResponse } from 'http';
import { ErrorMessage, StatusCode } from '../../src/app/constants';
import { CustomError } from '../../src/app/exception';
import { addUser, deleteUser, getAllUsers, getUser, updateUser } from './users.service';
import { User } from './users.model';

export const requestListener = async function (request: IncomingMessage, response: ServerResponse) {
  response.setHeader('Content-Type', 'application/json');
  const [firstPart, secondPart, userID, ...rest] = request.url.substring(1).split('/');

  switch (request.url) {
    case '/api/users': {
      if (request.method === 'GET') {
        try {
          const users = await getAllUsers();
          response.end(JSON.stringify(users));
          response.statusCode = StatusCode.OK;
        } catch (error) {
          sendErrorMessage(response, error);
        }

        return;
      }

      if (request.method === 'POST') {
        const chunks = [] as any;

        request.on('data', (chunk) => {
          chunks.push(chunk);
        });

        request.on('end', async () => {
          const result = Buffer.concat(chunks).toString();
          try {
            let user: User | Record<string, User>;
            let json;

            try {
              json = JSON.parse(result);
            } catch (error) {
              sendErrorMessage(response);
            }

            user = await addUser(json);
            response.statusCode = StatusCode.CREATED;
            response.end(JSON.stringify(user));
          } catch (error) {
            sendErrorMessage(response, error);
            return;
          }
        });

        return;
      }

      response.statusCode = StatusCode.NOT_FOUND;
      response.end({"code": response.statusCode, "message": ErrorMessage.MALFORMED_REQUEST});
      break;
    }
    case '/api/users/' + userID: {

      if (request.method === 'GET') {
        try {
          const user = await getUser(userID);
          if (user) {
            response.statusCode = StatusCode.OK;
            response.end(JSON.stringify(user));

          } else {
            throw new CustomError(StatusCode.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
          }
        } catch (error) {
          sendErrorMessage(response, error);
        }
        return;
      }

      if (request.method === 'PUT') {

        const chunks = [] as any;

        request.on('data', (chunk) => {
          chunks.push(chunk);
        });

        request.on('end', async () => {
          const result = Buffer.concat(chunks).toString();
          try {
            let json;

            try {
              json = JSON.parse(result);
            } catch (error) {
              sendErrorMessage(response);
            }

            const user = await updateUser(userID, json);
            response.statusCode = StatusCode.OK;
            response.end(JSON.stringify(user));

          } catch (error) {
            sendErrorMessage(response, error);
          }
        });

        return;
      }

      if (request.method === 'DELETE') {
        try {
          await deleteUser(userID);
          response.statusCode = StatusCode.NO_CONTENT;
        } catch (error) {
          sendErrorMessage(response, error);
        }

        return;
      }

      response.statusCode = StatusCode.NOT_FOUND;
      response.end(JSON.stringify({"code": response.statusCode, "message": ErrorMessage.MALFORMED_REQUEST}));
      break;
    }
    default: {
      response.statusCode = StatusCode.NOT_FOUND;
      response.end(JSON.stringify({"code": response.statusCode, "message": ErrorMessage.MALFORMED_REQUEST}));
    }
  }
};

function sendErrorMessage(response: ServerResponse<IncomingMessage>, error?: any) {
  response.statusCode = error && error.statusCode ? error.statusCode : StatusCode.SERVER_ERROR;
  response.end(JSON.stringify({"code": response.statusCode, "message": error && error.message != '' ? error.message : ErrorMessage.INTERNAL_ERROR}));
}