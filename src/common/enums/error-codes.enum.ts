export enum ErrorCodes {
  InvalidForm = 'errors.invalid-form',

  InvalidOtp = 'errors.invalid-otp',
  InvalidFirebaseToken = 'errors.invalid-firebase-token',
  AccessDenied = 'errors.access-denied',

  FieldShouldNotBeEmpty = 'errors.field-invalid.should-not-be-empty',
  FieldShouldBeString = 'errors.field-invalid.should-be-string',
  FieldShouldBeNumber = 'errors.field-invalid.should-be-number',
  FieldShouldBeEnum = 'errors.field-invalid.should-be-enum',
  FieldShouldBeEmail = 'errors.field-invalid.should-be-email',

  NotAuthorizedRequest = 'errors.not-authorized.request',
  InvalidStatus_UserInactive = 'errors.invalid-status.user-inactive',
  NotExists_User = 'errors.auth.not-exists.user',
  UserWithEmailExists = 'errors.auth.user-already-exists',
  UserCreationFailed = 'errors.auth.user-creation-failed',
  UserNotVerified = 'errors.auth.user-is-not-verified',
  UserAlreadyVirified = 'errors.auth.user-already-verified',
  ExitNotExecuted = 'errors.auth.exit-not-executed',

  RecordAlreadyExist = 'errors.record-already-exist',
  RecordCreationFailed = 'errors.record-creation-failed"',
  NotExists_Record = 'errors.not-exists-record',
}
