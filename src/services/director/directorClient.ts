/* eslint-disable @typescript-eslint/no-explicit-any */
import { DirectorClientError } from '@domain/error/externalClientError';
import { InternalService } from '@src/gen/director';
import logger from '@src/logger';

export class DirectorClient {
  async createUser(username: string): Promise<void> {
    try {
      await InternalService.postInternalUsers({
        requestBody: {
          username
        }
      });
    } catch (error: unknown) {
      const details = {
        message: error instanceof Error ? error.message : String(error),
        status: (error as any)?.status,
        body: (error as any)?.body,
        url: (error as any)?.url
      };
      logger.error('Failed to create user in Director', details);
      throw DirectorClientError.create();
    }
  }

  async loginUser(username: string): Promise<void> {
    try {
      await InternalService.postInternalUsers({
        requestBody: {
          username
        }
      });
    } catch (error: unknown) {
      const details = {
        message: error instanceof Error ? error.message : String(error),
        status: (error as any)?.status,
        body: (error as any)?.body,
        url: (error as any)?.url
      };
      logger.error('Failed to login user in Director', details);
      throw DirectorClientError.create();
    }
  }

  async logoutUser(username: string): Promise<void> {
    try {
      await InternalService.postInternalLogout({
        requestBody: {
          username
        }
      });
    } catch (error: unknown) {
      const details = {
        message: error instanceof Error ? error.message : String(error),
        status: (error as any)?.status,
        body: (error as any)?.body,
        url: (error as any)?.url
      };
      logger.error('Failed to logout user in Director', details);
      throw DirectorClientError.create();
    }
  }
}

export const directorClient = new DirectorClient();
