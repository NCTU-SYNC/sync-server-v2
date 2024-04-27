import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { FirebaseError } from 'firebase-admin';

@Catch()
export class FirebaseExceptionFilter implements ExceptionFilter {
  catch(error: FirebaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { code, message } = error;
    const status = this.getStatus(code);

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }


  
  private getStatus(code: string) {
    // TODO: Provide a more detailed status code.
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
