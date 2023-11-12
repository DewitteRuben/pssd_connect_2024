type ExpressErrorPayload = {
  message: string;
  code: number;
  success?: boolean;
};

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
