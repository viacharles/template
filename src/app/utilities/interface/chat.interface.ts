import {EContent} from '@utilities/enum/common.enum';

export interface TempReplyContent {
  finish: boolean;
  content: string;
}
export interface TempReplyMessage {
  conversationID: string;
  requestID: string;
  replyID: string;
  isTyping: boolean;
  contents: TempReplyContent[];
}
export interface ConversationMessage {
  conversationID: string;
  provider: string;
  model: string;
  temperature: number;
  topP: number;
  requestID: string;
  humanMessage: string;
  historieIDs: string[];
  token?: string;
  indexName?: 'cathay6r';
}
export interface ReplyMessage {
  conversationID: string;
  requestID: string;
  replyID: string;
  content: string;
  finish: boolean;
  type?: IMessageType;
}
export type IMessageType =
  | EContent.Error
  | EContent.Paused
  | EContent.NoResponse;
/**
 * @param noResponse 取消時還沒有任何內容
 */
export interface ChatMessage {
  id: string;
  content: string;
  isUserMessage: boolean;
  isFinished: boolean;
  type?: IMessageType;
}
export interface ChatCollection {
  conversationID: string;
  provider: string;
  model: string;
  temperature: number;
  temperatureMax: number;
  name: string;
  active: boolean;
  messages: ChatMessage[];
}
export interface ChatService {
  name: string;
  aifunction: string;
  provider: string;
  model: string;
  temperature: number;
  temperatureMax: number;
  icon: string;
  active: boolean;
  chatCollections: ChatCollection[];
}
