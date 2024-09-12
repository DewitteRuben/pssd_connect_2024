type ExpressErrorPayload = {
  message: string;
  code: number;
  success?: boolean;
};

type DatabaseErrorPayload = {
  message?: string;
  code: number;
  success?: boolean;
};

export class DatabaseError extends Error {
  code: number;
  constructor(payload: DatabaseErrorPayload) {
    super(payload.message);
    payload.success = false;
    this.code = payload.code;
  }
}

export class ExpressError extends Error {
  payload: ExpressErrorPayload;
  code: number;
  constructor(payload: ExpressErrorPayload) {
    super(payload.message);
    payload.success = false;

    this.code = payload.code;
    this.payload = payload;
  }
}
