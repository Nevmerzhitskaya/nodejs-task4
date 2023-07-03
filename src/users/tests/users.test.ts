import { server } from '../../../src/index';
import { ErrorMessage, StatusCode } from '../../../src/app/constants';
import request from 'supertest';

const path = '/api/users';

let testUser = {id: undefined, username: "aaaaa", age: 18, hobbies: ["dance", "cooking"] };
let testUser2 = {username: "TEST2222", age: 20, hobbies: ["dance", "cooking"] };
let testUser3 = {id: undefined, username: "", age: 18, hobbies: ["dance", "cooking"] };
let testUser4 = {id: undefined, username: "TEST", age: 18 };
let testUser5 = {id: undefined, username: "TEST", age: '', hobbies: ["dance", "cooking"] };

describe('Scenario 1 ', () => {

    it('should return empty object', async () => {
        const empty = {};
        const response = await request(server).get(path);

        expect(response.statusCode).toBe(StatusCode.OK);
        expect(response.body).toEqual(empty);
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
    
    it('should return user', async () => {
        const response = await request(server).get(path + '/' + testUser.id);

        expect(response.statusCode).toBe(StatusCode.OK);
        expect(response.body).toEqual(testUser);
    })   
    
    it('should return updated user', async () => {
        const response = await request(server).put(path + '/' + testUser.id).send(testUser2);

        expect(response.statusCode).toBe(StatusCode.OK);
        expect(response.body.id).not.toBe('');
        expect(response.body.username).toEqual(testUser2.username);
        expect(response.body.age).toEqual(testUser2.age);
        expect(response.body.hobbies).toEqual(testUser2.hobbies);
    })    
    
    it('should delete user', async () => {
        const response = await request(server).delete(path + '/' + testUser.id);

        expect(response.statusCode).toBe(StatusCode.NO_CONTENT);
    })
    
    it('there is no such object', async () => {
        const response = await request(server).get(path + '/' + testUser.id);

        expect(response.statusCode).toBe(StatusCode.NOT_FOUND);
    })   
})

describe('Scenario 2', () => {

    it('should return empty object', async () => {
        const empty = {};
        const response = await request(server).get(path);

        expect(response.statusCode).toBe(StatusCode.OK);
        expect(response.body).toEqual(empty);
    })

    it('if empty username should return error message', async () => {          
        const response = await request(server).post(path).send(testUser3);
        expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
        expect(response.body).toEqual({"code":StatusCode.BAD_REQUEST,"message": ErrorMessage.ERROR_VALIDATION});
    })

    it('if no age should return error message', async () => {
        const response = await request(server).post(path).send(JSON.stringify(testUser5));
        expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
        expect(response.body).toEqual({"code":StatusCode.BAD_REQUEST,"message": ErrorMessage.ERROR_VALIDATION});
    })

    it('if no hobbies should return error message', async () => {
        const response = await request(server).post(path).send(JSON.stringify(testUser4));
        expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
        expect(response.body).toEqual({"code":StatusCode.BAD_REQUEST,"message": ErrorMessage.ERROR_VALIDATION});
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

    it('should return newly created user', async () => {
        const response = await request(server).post(path).send(testUser);
        expect(response.statusCode).toBe(StatusCode.CREATED);
        expect(response.body.id).not.toBe('');
        expect(response.body.username).toEqual(testUser.username);
        expect(response.body.age).toEqual(testUser.age);
        expect(response.body.hobbies).toEqual(testUser.hobbies);
        testUser.id = response.body.id;
    })

    it('should return number of user', async () => {
        const response = await request(server).get(path);

        expect(response.statusCode).toBe(StatusCode.OK);
        expect(Object.keys(response.body).length).toEqual(2);
    })

})

describe('Scenario 3 - get user by its id', () => {


    it('should return newly created user', async () => {
        const response = await request(server).post(path).send(testUser);
        expect(response.statusCode).toBe(StatusCode.CREATED);
        expect(response.body.id).not.toBe('');
        expect(response.body.username).toEqual(testUser.username);
        expect(response.body.age).toEqual(testUser.age);
        expect(response.body.hobbies).toEqual(testUser.hobbies);
        testUser.id = response.body.id;
    })

    it('should return error message that no user with this id', async () => {
        const response = await request(server).get(path + '/aa1a6824-b822-40a5-8324-6a6c311bc198');

        expect(response.statusCode).toBe(StatusCode.NOT_FOUND);
        expect(response.body).toEqual({"code":StatusCode.NOT_FOUND,"message": ErrorMessage.USER_NOT_FOUND});
    })

    it('should return error message that id is invalid', async () => {
        const response = await request(server).get(path + '/aa1a6824-b822-40a5-8324-asdasdas');

        expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
        expect(response.body).toEqual({"code":StatusCode.BAD_REQUEST,"message": ErrorMessage.INVALID_USER_ID});
    })
    
    it('should delete user', async () => {
        const response = await request(server).delete(path + '/' + testUser.id);

        expect(response.statusCode).toBe(StatusCode.NO_CONTENT);
    })    

    it('should return object', async () => {
        const response = await request(server).get(path);

        expect(response.statusCode).toBe(StatusCode.OK);
        expect(response.body).toEqual(expect.any(Object));
    })

})