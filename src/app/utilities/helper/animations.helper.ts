import {
  AnimationTriggerMetadata,
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { delay } from 'rxjs';

export function slideEnterAndOutScreen(): AnimationTriggerMetadata {
  return trigger('slideInOut', [
    transition(':enter', [
      style({opacity: 0, transform: 'translateX(-10%)'}),
      animate(
        '300ms ease-in-out',
        style({opacity: 1, transform: 'translateX(0)'})
      ),
    ]),
    transition(':leave', [
      style({opacity: 1, transform: 'translateX(0)'}),
      animate(
        '300ms ease-in-out',
        style({opacity: 0, transform: 'translateX(-10%)'})
      ),
    ]),
  ]);
}

/** 左側平移進入 */
export function slideEnter(): AnimationTriggerMetadata {
  return trigger('slideIn', [
    transition(':enter', [
      style({opacity: 0, transform: 'translateX(-10%)'}),
      animate(
        '300ms ease-in-out',
        style({opacity: 1, transform: 'translateX(0)'})
      ),
    ]),
  ]);
}

/** 淡入淡出
 * @param OccurDelay 動畫發生前延遲(ms)
 */
export function fadeEnterAndHideOut(
  OccurDelay?: number
): AnimationTriggerMetadata {
  return trigger('fadeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate('100ms ease-in-out', style({opacity: 1})),
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate('200ms', style({opacity: 0})),
    ]),
  ]);
}

/** 淡入+放大 淡出+縮小
 */
export function fadeEnterAndHideOutSmaller(
  OccurDelay?: number
): AnimationTriggerMetadata {
  return trigger('fadeInOutSize', [
    transition(':enter', [
      style({opacity: 0.5, transform: 'scale(0.95)'}),
      animate('50ms ease-in-out', style({opacity: 1, transform: 'scale(1)'})),
    ]),
    transition(':leave', [
      style({opacity: 1, transform: 'scale(1)'}),
      animate('50ms', style({opacity: 0.5, transform: 'scale(0.95)'})),
    ]),
  ]);
}

/** 淡入+左側平移進入置中&淡出+右側平移移出
 */
export function fadeSlideInAndHideSlideOut(): AnimationTriggerMetadata {
  return trigger('fadeSlideInOut', [
    transition(':enter', [
      style({opacity: 0, transform: 'translate(-53%, -50%)'}),
      animate(
        '300ms ease-in-out',
        style({opacity: 1, transform: 'translate(-50%, -50%)'})
      ),
    ]),
    transition(':leave', [
      style({opacity: 1, transform: 'translate(-50%, -50%)'}),
      animate('0ms', style({opacity: 0, transform: 'translate(-53%, -50%)'})),
    ]),
  ]);
}

/** dialog:
 * 逐漸消失
 */
export function fadeOut(): AnimationTriggerMetadata {
  return trigger('fadeOut', [
    transition(':leave', [
      style({opacity: 1, transform: 'translate(-50% -50%) '}),
      animate('200ms', style({opacity: 0, transform: 'translate(-50% -50%)'})),
    ]),
  ]);

}

/** 卡片
 * 下往上淡入+壓縮淡出
 * @param OccurDelay 動畫發生前延遲(ms)
 */
export function upFadeInAndCompressOut(): AnimationTriggerMetadata {
  return trigger('upInCompressOut', [
    transition(':enter', [
      style({opacity: 0, transform: 'translate(0%, 10%)'}),
      animate(
        '300ms ease-in-out',
        style({opacity: 1, transform: 'translate(0, 0)'})
      ),
    ]),
    transition(':leave', [
      style({opacity: 1, transform: 'scale(100%, 100%)'}),
      animate('0ms', style({opacity: 0, transform: 'scale(90%, 100%)'})),
    ]),
  ]);
}

/** 卡片
 * 上往下淡入+壓縮淡出
 * @param OccurDelay 動畫發生前延遲(ms)
 */
export function downFadeInAndCompressOut(): AnimationTriggerMetadata {
  return trigger('downInCompressOut', [
    transition(':enter', [
      style({opacity: 0, transform: 'translate(0%, -10%)'}),
      animate(
        '300ms ease-in-out',
        style({opacity: 1, transform: 'translate(0, 0)'})
      ),
    ]),
    transition(':leave', [
      style({opacity: 1, transform: 'scale(100%, 100%)'}),
      animate('0ms', style({opacity: 0, transform: 'scale(90%, 100%)'})),
    ]),
  ]);
}

/** 垂直 縮消失/長出現  */
export function verticalShortenOut(): AnimationTriggerMetadata {
  return trigger('verticalShortenOut', [
    transition(':enter', [
      style({opacity: 0, height: 0}),
      animate('500ms', style({opacity: 1, height: 'auto'})),
    ]),
    transition(':leave', [
      style({opacity: 1, height: 'auto'}),
      animate('500ms', style({opacity: 0, height: 0})),
    ]),
  ]);
}

/** dialog：
 * 放大進入，垂直壓縮消失 */
export function scaleInShortenOut(): AnimationTriggerMetadata {
  return trigger('scaleInShortenOut', [
    transition(':enter', [
      style({opacity: 0, transform: 'translate(-50%, -50%) scale(0.98)'}),
      animate('200ms ease-in-out', style({opacity: 1, transform: 'translate(-50%, -50%) scale(1)'})),
    ]),
    transition(':leave', [
      style({opacity: 1, transform: 'translate(-50%, -50%) scale(100%, 100%)'}),
      animate('100ms ease-in-out',
      keyframes ([
        style({opacity: 0,  transform: 'translate(-50%, -50%) scale(80%, 100%)', offset: 0.4}),
        style({opacity: 0,  transform: 'translate(-50%, -50%) scale(70%, 100%)', offset: 1})
    ])),
    ]),
  ]);
}
