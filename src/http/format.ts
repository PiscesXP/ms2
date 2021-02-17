//统一HTTP格式
interface CodeAndMessage {
  code: number;
  message: string;
}

interface ResponseSchema {
  readonly code: number;
  readonly message?: string;
  readonly data: any;
}

export enum ResponseCode {
  success = 0,
  authInvalid = 2,
  backupFailed = 3,
  restartFailed = 4,
  unknownError = 999,
}

export const formatResponse = ({
  data = null,
  code = ResponseCode.success,
  message = "",
}: {
  data?: any;
  code?: ResponseCode;
  message?: string;
} = {}): ResponseSchema => {
  return {
    code,
    message,
    data,
  };
};
