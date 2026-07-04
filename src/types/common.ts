export interface ServerReturn<T = null> {
  success: boolean;
  message?: string;
  error?: Error | string;
  data?: T;
}
