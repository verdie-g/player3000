export enum ServiceCode {
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

export class ServiceResult<T> {
  constructor(
    public code: ServiceCode,
    public ok: boolean,
    public data?: T,
  ) {
  }

  static error<T>(code: ServiceCode): ServiceResult<T> {
    return new ServiceResult(code, false);
  }

  static ok<T>(code: ServiceCode, data?: T): ServiceResult<T> {
    return new ServiceResult(code, true, data);
  }
}
