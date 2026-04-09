export class ValidationError extends Error {
  readonly code = "VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  readonly code = "NOT_FOUND";

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  readonly code = "CONFLICT";

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export type ErrorPayload = {
  status: number;
  body: {
    error: {
      code: string;
      message: string;
    };
  };
};

export function toErrorPayload(error: unknown): ErrorPayload {
  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: {
        error: {
          code: error.code,
          message: error.message
        }
      }
    };
  }

  if (error instanceof NotFoundError) {
    return {
      status: 404,
      body: {
        error: {
          code: error.code,
          message: error.message
        }
      }
    };
  }

  if (error instanceof ConflictError) {
    return {
      status: 409,
      body: {
        error: {
          code: error.code,
          message: error.message
        }
      }
    };
  }

  console.error(error);

  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went sideways. Please try again."
      }
    }
  };
}

