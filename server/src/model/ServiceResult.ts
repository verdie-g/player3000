export enum ServiceCode {
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

export class ServiceResult<T> {
  public code: ServiceCode;
  public data?: T;
  public ok: boolean;

  static error<T>(code: ServiceCode): ServiceResult<T> {
    return {
      code,
      data: null,
      ok: false,
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
