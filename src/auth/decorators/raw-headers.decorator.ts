import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const rawHeaders = request.rawHeaders;

    const headers: { [key: string]: string } = {};

    rawHeaders.forEach((header: string, index: number) => {
      if (index % 2 === 0) {
        headers[header] = rawHeaders[index + 1];
      }
    });

    return headers;
  },
);
