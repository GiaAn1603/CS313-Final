import { BACKEND_CONFIG } from "./config";
import type { Storm, StormTrack } from "./types";

class StormAPI {
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Storm API Error: ${response.statusText}`);
    }
    return response.json();
  }

  async getStormTracksById(stormID: string): Promise<StormTrack[]> {
    const url = `${BACKEND_CONFIG.BASE_URL}${BACKEND_CONFIG.ENDPOINTS.STORM_TRACKS(stormID)}`;
    return this.fetchData<StormTrack[]>(url);
  }

  async getStormsListByYear(year: string | number): Promise<Storm[]> {
    const url = `${BACKEND_CONFIG.BASE_URL}${BACKEND_CONFIG.ENDPOINTS.STORMS_LIST(year)}`;
    return this.fetchData<Storm[]>(url);
  }
}

export const stormAPI = new StormAPI();
