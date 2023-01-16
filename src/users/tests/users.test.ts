import { server } from '../../../src/index';
import { ErrorMessage, StatusCode } from '../../../src/app/constants';
import request from 'supertest';

const path = '/api/users';

let testUser = {id: undefined, username: "TEST", age: 18, hobbies: ["dance", "cooking"] };

describe('Scenario 1 - Get all users', () => {
    it('should return empty object', async () => {
        const empty = {};
        const response = await request(server).get(path);

        expect(response.statusCode).toBe(StatusCode.OK);
        expect(response.body).toEqual(empty);
    })
})

describe('Scenario 2 - A new user is created', () => {

    it('if no username should return error message', async () => {
        testUser.username = undefined;            
        const response = await request(server).post(path).send(testUser);
        expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
        expect(response.text).toEqual(ErrorMessage.ERROR_VALIDATION);
        testUser.username = 'Victor';
    })

    it('if empty username should return error message', async () => {
        testUser.username = '';            
        const response = await request(server).post(path).send(testUser);
        expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
        expect(response.text).toEqual(ErrorMessage.ERROR_VALIDATION);
        testUser.username = 'Victor';
    })

    it('if no age should return error message', async () => {
        testUser.age = undefined;
        const response = await request(server).post(path).send(JSON.stringify(testUser));
        expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
        expect(response.text).toEqual(ErrorMessage.ERROR_VALIDATION);
        testUser.age = 55;
    })

    it('if no hobbies should return error message', async () => {
        testUser.hobbies = undefined;
        const response = await request(server).post(path).send(JSON.stringify(testUser));
        expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
        expect(response.text).toEqual(ErrorMessage.ERROR_VALIDATION);
        testUser.hobbies = ["dance", "cooking"];
    })    

    it('should return newly created user', async () => {
        const response = await request(server).post(path).send(testUser);

        expect(response.statusCode).toBe(StatusCode.CREATED);
        expect(response.body.id).not.toBe('');
        expect(response.body.username).toEqual(testUser.username);
        expect(response.body.age).toEqual(testUser.age);
        expect(response.body.hobbies).toEqual(testUser.hobbies);
        testUser.id = response.body.id;
    })
})

describe('Scenario 3 - get user by its id', () => {
    it('should return user', async () => {
        const response = await request(server).get(path + '/' + testUser.id);

        expect(response.statusCode).toBe(StatusCode.OK);
        expect(response.body).toEqual(testUser);
    })

    it('should return error message that no user with this id', async () => {
        const response = await request(server).get(path + '/aa1a6824-b822-40a5-8324-6a6c311bc198');

        expect(response.statusCode).toBe(StatusCode.NOT_FOUND);
        expect(response.text).toEqual(ErrorMessage.USER_NOT_FOUND);
    })

    it('should return error message that id is invalid', async () => {
        const response = await request(server).get(path + '/aa1a6824-b822-40a5-8324-asdasdas');

        expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
        expect(response.text).toEqual(ErrorMessage.INVALID_USER_ID);
    })
})