import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpProgressEvent,
  HttpResponse,
} from '@angular/common/http';
import {ELoadingStatus} from '@utilities/enum/common.enum';
import {Observable} from 'rxjs';
import {distinctUntilChanged, scan, take} from 'rxjs/operators';

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(
  event: HttpEvent<unknown>
): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  );
}

function isErrorResponse(event: HttpEvent<unknown>) {
  return event instanceof HttpErrorResponse;
}

export interface Download {
  content: Blob | string | null;
  progress: number;
  state: ELoadingStatus;
  error?: any;
}

export function download(
  saver?: (b: Blob | string) => void
): (source: Observable<HttpEvent<Blob | string>>) => Observable<Download> {
  return (source: Observable<HttpEvent<Blob | string>>) =>
    source.pipe(
      scan(
        (download: Download, event): Download => {
          if (isHttpProgressEvent(event)) {
            return {
              progress: event.total
                ? Math.round((100 * event.loaded) / event.total)
                : download.progress,
              state: ELoadingStatus.Loading,
              content: null,
            };
          }
          if (isHttpResponse(event)) {
            if (saver) {
              saver(event.body as Blob | string);
            }
            return {
              progress: 100,
              state: ELoadingStatus.Complete,
              content: event.body,
            };
          }
          if (isErrorResponse(event)) {
            return {
              progress: 0,
              state: ELoadingStatus.Error,
              content: null,
              error: (event as any).error,
            };
          }
          return download;
        },
        {state: ELoadingStatus.Loading, progress: 0, content: null}
      ),
      distinctUntilChanged(
        (a, b) =>
          a.state === b.state &&
          a.progress === b.progress &&
          a.content === b.content
      )
    );
}
