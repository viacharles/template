import {Clipboard} from '@angular/cdk/clipboard';
import {HttpClient} from '@angular/common/http';
import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {ActivatedRoute, Router, Event, NavigationEnd} from '@angular/router';
import {TranslateService} from '@core/services/translate.service';
import {UsersService} from '@core/services/users.service';
import {environment} from 'src/environments/environment';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {OverlayService} from '@shared/service/overlay.service';
import { EIndividualPages} from '@utilities/enum/router.enum';
import { take, takeUntil, timer } from 'rxjs';
import { UnSubOnDestroy } from '@utilities/abstract/unSubOnDestroy.abstract';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends UnSubOnDestroy implements OnInit {
  @ViewChild('tText') tText?: ElementRef<HTMLElement>;

  showFull = true;
  ghostConsoleStr = ''; // the current catch
  ghostConsolePass = '``22'; // opens the console
  ghostTranslatePass = '``11'; // quickly switches the i18n lang between en and zh
  versionInfo: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private translateService: TranslateService,
    private http: HttpClient,
    private clipboard: Clipboard,
    private $overlay: OverlayService,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
    private selfElem: ElementRef<HTMLElement>
  ) {
    super();
    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const path = event.urlAfterRedirects.replace('/^\/|\/$/', '').split('?')[0];
        this.setStyleByPath(path);
      }
    });

  }

  ngOnInit(): void {
  }

  @HostListener('document:keyup', ['$event'])
  keypress(e: KeyboardEvent) {
    const ghostConsoleInput =
      e.target?.toString() === '[object HTMLBodyElement]';

    if (!ghostConsoleInput) {
      this.ghostConsoleStr = '';
      return;
    }

    if (e.key === 'Backspace') {
      this.ghostConsoleStr = '';
      return;
    }

    this.ghostConsoleStr += e.key;
      this.translateService.toggleLang();
      this.ghostConsoleStr = '';
  }

  /** 更換背景色 */
  private setStyleByPath(path: string): void {
    switch (path) {
      case EIndividualPages.Home:
        this.renderer.setStyle(
          this.selfElem?.nativeElement,
          'backgroundColor',
          'white'
        );
        timer(100).pipe(take(1)).subscribe(() => this.renderer.removeClass(this.tText?.nativeElement, 'mt-8'));
        break;
      default:
        this.renderer.setStyle(
          this.selfElem?.nativeElement,
          'backgroundColor',
          '#FAFAFA'
        );
        timer(100).pipe(take(1)).subscribe(() => this.renderer.addClass(this.tText?.nativeElement, 'mt-8'));
        this.showFull = false;
        break;
    }
  }

  versionClick() {
    // copy versionInfo to agent-clipboard
    if (!environment.production) console.log(this.versionInfo);
    this.clipboard.copy(this.versionInfo);
    this.snackBar.open('複製到剪貼板!', '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }



  @HostListener('document:mouseup', ['$event'])
  mouseup(e: MouseEvent) {
    this.ghostConsoleStr = '';
  }
}
