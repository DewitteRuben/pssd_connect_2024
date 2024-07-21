export const successResponse = (json?: any) => {
  return { status: 200, success: true, result: json ?? {} };
};
