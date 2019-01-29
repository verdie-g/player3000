export enum ServiceCode {
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

export class ServiceResult<T> {
  public ok: boolean;
  public code: ServiceCode;
  public data?: T;

  static error<T>(code: ServiceCode): ServiceResult<T> {
    return {
      code,
      ok: false,
      data: null,
    };
  }

  static ok<T>(code: ServiceCode, data?: T): ServiceResult<T> {
    return {
      code,
      data,
      ok: true,
    };
  }
}
