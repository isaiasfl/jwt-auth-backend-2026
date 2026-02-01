export const successResponse = <T>(data: T) => {
  return {
    ok: true,
    data,
  };
};

export const errorResponse = (
  code: string,
  message: string,
  details?: unknown
) => {
  return {
    ok: false,
    error: {
      code,
      message,
      details,
    },
  };
};
