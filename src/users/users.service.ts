import { ErrorMessage, StatusCode } from '../../src/app/constants';
import { CustomError } from '../../src/app/exception';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { InMemoryDatabase, User } from './users.model';

const instanceDB = new InMemoryDatabase<User>();
const badRequest = new CustomError(StatusCode.BAD_REQUEST, ErrorMessage.ERROR_VALIDATION);

export const addUser = async (obj: User) => {
    
    if (!(obj?.age && obj.age != null && typeof obj.age === 'number')) throw badRequest;
    if (!(obj?.username && obj.username != '' && typeof obj.username === 'string')) throw badRequest;
    if (!(obj?.hobbies && Array.isArray(obj.hobbies) && obj.hobbies.every(i => typeof i === "string"))) throw badRequest;
    
    obj.id = uuidv4();

    instanceDB.set(obj);

    return await getUser(obj.id);
}

export const updateUser = async (id: string, obj: User) => {
    if (!id) throw new CustomError(StatusCode.BAD_REQUEST, ErrorMessage.ERROR_VALIDATION);
    if (!uuidValidate(id)) throw new CustomError(StatusCode.BAD_REQUEST, ErrorMessage.INVALID_USER_ID);

    const user = instanceDB.get(id);
    obj.id = id;

    if(!user) throw new CustomError(StatusCode.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    if (!(obj?.age && obj.age != null && typeof obj.age === 'number')) throw badRequest;
    if (!(obj?.username && obj.username != '' && typeof obj.username === 'string')) throw badRequest;
    if (!(obj?.hobbies && Array.isArray(obj.hobbies) && obj.hobbies.every(i => typeof i === "string"))) throw badRequest;

    instanceDB.set(obj);

    return await getUser(id);    
}

export const getAllUsers = async () => {
    return instanceDB.get();
}

export const getUser = async (id: string) => {
    if (!uuidValidate(id)) throw new CustomError(StatusCode.BAD_REQUEST, ErrorMessage.INVALID_USER_ID);

    return instanceDB.get(id);
}


export const deleteUser = async (id: string) => {
    if (!uuidValidate(id)) throw new CustomError(StatusCode.BAD_REQUEST, ErrorMessage.INVALID_USER_ID);
    const user = instanceDB.get(id);
    if(!user) throw new CustomError(StatusCode.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);

    return instanceDB.delete(id);
}