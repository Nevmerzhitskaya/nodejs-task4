export const enum StatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    CREATED = 201,
    NO_CONTENT = 204,
    SERVER_ERROR = 500
}

export const enum ErrorMessage {
    USER_NOT_FOUND = 'User not found',
    ERROR_VALIDATION = 'Body does not contain required fields',
    MALFORMED_REQUEST = 'The request was malformed',
    INTERNAL_ERROR = 'Internal server error',
    INVALID_USER_ID = 'User id is invalid'
}