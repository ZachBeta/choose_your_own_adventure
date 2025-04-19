import axios, { AxiosRequestConfig } from "axios";

export type SubconsciousLogger = (text: string, isStreaming: boolean) => void;

export async function apiRequest<T>(
  config: AxiosRequestConfig,
  log?: SubconsciousLogger
): Promise<T> {
  if (log) log(
    `API CALL: ${config.method?.toUpperCase() || 'GET'} ${config.url}\n${config.data ? JSON.stringify(config.data, null, 2) : ""}`,
    true
  );
  try {
    const response = await axios(config);
    if (log) log(`API RESPONSE: ${JSON.stringify(response.data, null, 2)}`, false);
    return response.data;
  } catch (e: any) {
    if (log) {
      if (e.response) {
        log(
          `API ERROR: HTTP ${e.response.status} ${e.response.statusText}\n${JSON.stringify(e.response.data, null, 2)}`,
          false
        );
      } else if (e.request) {
        log(`API ERROR: No response received\n${e.message}`, false);
      } else {
        log(`API ERROR: ${e.message || e.toString()}`, false);
      }
    }
    throw e;
  }
}
