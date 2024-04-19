import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IOption } from "./common.interface";
import { ESize } from "@utilities/enum/common.enum";
import { EFieldMemoType, EInputType } from "@utilities/enum/form.enum";

export type Unpacked<T> = T extends Array<infer U> ? U : T;

export type ToForm<OriginalType> = {
  [key in keyof OriginalType]
    : OriginalType[key] extends Array<any>
      ? FormArray<
        Unpacked<OriginalType[key]> extends object
          ? FormGroup<ToForm<Unpacked<OriginalType[key]>>>
          : FormControl<Unpacked<OriginalType[key]> | null>
        >
      :OriginalType[key] extends object
        ? FormGroup<ToForm<OriginalType[key]>>
        : FormControl<OriginalType[key] | null>
};

/** 動態欄位選項 */
export interface IDynamicOption<T> extends IOption<T> {
  /** 有說明欄位 */
  hasMemo?: boolean,
  /** 說明欄位的 placeholder */
  memoPlaceholder?: string,
  /** 說明欄位的尺寸 */
  memoSize?: ESize,
  /** 說明欄位的型態 */
  memoFieldType?: EFieldMemoType,
  /** 說明欄輸入資料型態 */
  memoInputType?: EInputType,
  /** 說明欄內容 */
  memo?: string
}
