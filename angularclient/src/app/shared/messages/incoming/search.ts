export interface SearchResult {
  name: string;
  title: string;
  artistName: string;
  albumName: string;
  file: string;
  genre: string;
  comment: string;
  year: string;
  discNumber: string;
  length: number;
  track: number;
  position: number;
  id: number;
}

export interface SearchMsgPayload {
  searchResults: SearchResult[];
  searchResultCount: number;
  query: string;
}

export interface SearchRoot {
  payload: SearchMsgPayload;
  type: string;
}
