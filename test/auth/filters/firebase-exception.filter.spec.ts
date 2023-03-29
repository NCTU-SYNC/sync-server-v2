import { FirebaseExceptionFilter } from '../../../src/auth/filters/firebase-exception.filter';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { FirebaseError } from 'firebase-admin';

describe('FirebaseExceptionFilter', () => {
  let filter: FirebaseExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseExceptionFilter],
    }).compile();

    filter = module.get<FirebaseExceptionFilter>(FirebaseExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should return a 500 status code and error message', () => {
    const error = {
      code: 'test/code',
      message: 'test-error',
    } as unknown as FirebaseError;

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: () => response as unknown as Response,
    } as unknown as ArgumentsHost;

    filter.catch(error, host);

    const expected_status = HttpStatus.INTERNAL_SERVER_ERROR;

    expect(response.status).toHaveBeenCalledWith(expected_status);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: expected_status,
      message: error.message,
    });
  });
});
