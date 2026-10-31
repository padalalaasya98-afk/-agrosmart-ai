import {
  CropProfile,
  CropComparisonResponse,
  RecommendationInput,
  RecommendationResponse,
  SampleScenario
} from '@agrosmart/shared';

const API_BASE = '/api';

export const api = {
  // Fetch all crops
  async getCrops(query?: { category?: string; season?: string; search?: string }): Promise<CropProfile[]> {
    const params = new URLSearchParams();
    if (query?.category) params.append('category', query.category);
    if (query?.season) params.append('season', query.season);
    if (query?.search) params.append('search', query.search);

    const res = await fetch(`${API_BASE}/crops?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch crops');
    const data = await res.json();
    return data.crops;
  },

  // Fetch crop by ID
  async getCropById(id: string): Promise<CropProfile> {
    const res = await fetch(`${API_BASE}/crops/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch crop ${id}`);
    const data = await res.json();
    return data.crop;
  },

  // Compare crops
  async compareCrops(cropIds: string[]): Promise<CropComparisonResponse> {
    const res = await fetch(`${API_BASE}/crops/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropIds })
    });
    if (!res.ok) throw new Error('Failed to generate crop comparison');
    return await res.json();
  },

  // Generate recommendations
  async getRecommendations(input: RecommendationInput): Promise<{
    recordId: string;
    inputQuality: any;
    data: RecommendationResponse;
  }> {
    const res = await fetch(`${API_BASE}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to process recommendation');
    }

    const json = await res.json();
    
    // Also save in local storage for instant guest history
    saveGuestRecommendation({
      id: json.recordId || `guest_${Date.now()}`,
      createdAt: new Date().toISOString(),
      input,
      data: json.data
    });

    return json;
  },

  // Get sample scenarios
  async getSampleScenarios(): Promise<SampleScenario[]> {
    const res = await fetch(`${API_BASE}/sample-input`);
    if (!res.ok) throw new Error('Failed to fetch sample scenarios');
    const data = await res.json();
    return data.scenarios;
  },

  // Fetch weather
  async getWeather(location: string): Promise<any> {
    const res = await fetch(`${API_BASE}/weather?location=${encodeURIComponent(location)}`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();
    return data.weather;
  }
};

// Local storage helpers for Guest History
export interface GuestHistoryRecord {
  id: string;
  createdAt: string;
  input: RecommendationInput;
  data: RecommendationResponse;
}

const GUEST_STORAGE_KEY = 'agrosmart_guest_history';

export function getGuestHistory(): GuestHistoryRecord[] {
  try {
    const item = localStorage.getItem(GUEST_STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.error('Failed to read guest history from localStorage:', e);
    return [];
  }
}

export function saveGuestRecommendation(record: GuestHistoryRecord) {
  try {
    const existing = getGuestHistory();
    const updated = [record, ...existing.filter(r => r.id !== record.id)].slice(0, 30);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save guest history to localStorage:', e);
  }
}

export function deleteGuestRecommendation(id: string) {
  try {
    const existing = getGuestHistory();
    const filtered = existing.filter(r => r.id !== id);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete guest history item:', e);
  }
}
