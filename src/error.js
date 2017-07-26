/* @flow */
import {GromitError} from 'gromit';

export const userNotFound = GromitError.notFound('User not found', 'USER_NOT_FOUND');
export const usernameAndVerificationCodeRequired = GromitError.unauthorized('`username` and `verificationCode` are required', 'USERNAME_AND_VERIFICATION_CODE_ARE_REQUIRED');
export const usernameRequired = GromitError.unauthorized('`username` is required', 'USERNAME_IS_REQUIRED');
export const usernameAndPasswordRequired = GromitError.unauthorized('username` and `password` are required', 'USERNAME_AND_PASSWORD_ARE_REQUIRED');