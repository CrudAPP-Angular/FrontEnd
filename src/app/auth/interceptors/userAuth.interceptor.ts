import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable, switchMap, take } from "rxjs";

export const userAuthInterceptorFn: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const modifiedReq = req.clone({
        withCredentials: true
    });
    return next(modifiedReq);
}