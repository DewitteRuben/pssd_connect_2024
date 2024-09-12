type ExpressErrorPayload = {
  message: string;
  code: number;
  shortcode?: string;
  success?: boolean;
};

type DatabaseErrorPayload = {
  message?: string;
  code: number;
  shortcode?: string;
  success?: boolean;
};

export class DatabaseError extends Error {
  code: number;
  shortcode?: string;
  constructor(payload: DatabaseErrorPayload) {
    super(payload.message);
    payload.success = false;
    this.code = payload.code;
    this.shortcode = payload.shortcode;
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
