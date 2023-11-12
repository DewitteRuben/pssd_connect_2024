export const successResponse = (json: Object) => {
  return { status: 200, success: true, result: json };
};
