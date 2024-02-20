import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {AuthenticationService} from '@core/services/authentication.service';
import {OverlayService} from '@shared/service/overlay.service';
import {WindowService} from '@shared/service/window.service';
import {UnSubOnDestroy} from '@utilities/abstract/unSubOnDestroy.abstract';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-assistant-chat',
  templateUrl: './assistant-chat.component.html',
  styleUrls: ['./assistant-chat.component.scss'],
})
export class AssistantChatComponent
  extends UnSubOnDestroy
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('tChatRoom', {static: true}) tChatRoom?: ElementRef;
  @ViewChild('tMessagesContainer') tMessagesContainer?: ElementRef;
  @ViewChildren('tMessage') tMessage?: QueryList<HTMLElement>;
  @ViewChild('tIcon') tIcon?: ElementRef;
  constructor(
    private $overlay: OverlayService,
    private $window: WindowService,
    private $auth: AuthenticationService,
    private renderer: Renderer2
  ) {
    super();
  }

  public paragraphs: IParagraph[] = [];
  /** 打字機顯示字段間隔動畫設定-第一階段 */
  private writeAnimateInterval: any = null;
  /** 打字機顯示字段間隔動畫設定-第二階段 */
  private quickWriteAnimateInterval: any = null;
  /** 第一階段的持續時間 */
  private firstWriteAnimTimeout: any = null;
  private resizeObserver?: ResizeObserver;
  ngOnInit(): void {
    this.$auth.isLoggedIn$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.paragraphs = [];
      this.hideChatRoom(true);
    });
    this.$overlay.getParagraph$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(paragraph => {
        if (this.writeAnimateInterval) {
          clearInterval(this.writeAnimateInterval);
        }
        if (this.quickWriteAnimateInterval) {
          clearInterval(this.quickWriteAnimateInterval);
        }
        clearTimeout(this.firstWriteAnimTimeout);
        if (paragraph) {
          this.hideChatRoom(false);
          this.paragraphs.push({
            text: paragraph.isSelf ? paragraph.text : '',
            isSelf: paragraph.isSelf,
            options: [],
          });
          if (!paragraph.isSelf) {
            this.writeAnimate(paragraph);
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.resizeObserver = this.$window.generateResizeObserver(() =>
      this.scrollToBottom()
    );
    this.tMessage?.changes.subscribe(nodes => {
      if (nodes && nodes.last) {
        this.resizeObserver?.disconnect();
        this.resizeObserver?.observe(nodes.last.nativeElement);
      }
    });
  }

  /** 助理回應option說明 */
  public responseOptionDesc({
    desc,
    title,
  }: {
    desc: string;
    title: string;
  }): void {
    this.$overlay.sendToAssistChat(title);
    this.$overlay.assistChatResponse(desc);
  }

  /** 顯示/隱藏聊天室 */
  public hideChatRoom(is: boolean): void {
    is
      ? this.renderer.addClass(this.tChatRoom?.nativeElement, 'hideChatRoom')
      : this.renderer.removeClass(
          this.tChatRoom?.nativeElement,
          'hideChatRoom'
        );
  }

  /** 執行打字機顯示字幕  */
  private writeAnimate(paragraph: IParagraph): void {
    const Text = paragraph.text;
    let textDisplay = '';
    let index = 0;
    this.writeAnimateInterval = setInterval(() => {
      if (index >= Text.length) {
        clearInterval(this.writeAnimateInterval);
        this.paragraphs[this.paragraphs.length - 1].options = paragraph.options;
        return;
      }
      textDisplay = textDisplay + Text[index];
      this.paragraphs[this.paragraphs.length - 1].text = textDisplay;
      index = index + 1;
    }, 100);
    if (this.writeAnimateInterval && Text.length >= index) {
      this.firstWriteAnimTimeout = setTimeout(() => {
        clearInterval(this.writeAnimateInterval);
        this.quickWriteAnimateInterval = setInterval(
          () => {
            if (index >= Text.length) {
              clearInterval(this.quickWriteAnimateInterval);
              clearTimeout(this.firstWriteAnimTimeout);
              this.paragraphs[this.paragraphs.length - 1].options =
                paragraph.options;
              return;
            }
            textDisplay = textDisplay + Text[index];
            this.paragraphs[this.paragraphs.length - 1].text = textDisplay;
            index = index + 1;
          },
          2000 / (Text.length - index)
        );
      }, 2000);
    }
  }

  private scrollToBottom(): void {
    const tMessagesContainer = this.tMessagesContainer?.nativeElement;
    tMessagesContainer.scrollTo({
      top: tMessagesContainer.scrollHeight - tMessagesContainer.clientHeight,
      behavior: 'smooth',
    });
  }

  override ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}

/** 對話段落
 * @param text 文字內容
 * @param isSelf 此段會話是否屬於使用者
 * @param options-title 選項標題
 * @param options-desc 選項說明
 * */
export interface IParagraph {
  text: string;
  isSelf: boolean;
  options?:
    | {
        title: string;
        desc: string;
      }[]
    | null;
}
