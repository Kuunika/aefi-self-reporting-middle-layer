import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggingService } from '../services';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly log: LoggingService) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest<Request>();
		this.log.info(`${Date.now()} - Inbound Request: Route ${request.url}; Method ${request.method}`);
		if (request.method !== 'GET') {
			this.log.info(JSON.stringify(request.body));
		}
		return next.handle().pipe(
			tap({
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				next: (val: unknown): void => {
					this.log.info(`${Date.now()} - Request Successful:  Route ${request.url}; Method ${request.method}`);
				},
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				error: (err: Error): void => {
					this.log.error(`${Date.now()} - Request Failed:  Route ${request.url}; Method ${request.method}`);
				},
			}),
		);
	}
}
