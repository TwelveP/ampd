import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { BackendSettings } from "../models/backend-settings";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ApiEndpoints } from "../api-endpoints";
import {
  BACKEND_ADDRESS_KEY,
  DARK_MODE_KEY,
  DISPLAY_COVERS_KEY,
  DISPLAY_SAVE_PLAYLIST_KEY,
  SET_TAB_TITLE,
} from "../local-storage-keys";
import { CoverBlacklistFiles } from "../models/cover-blacklist-files";
import { Location } from "@angular/common";
import { DarkTheme, LightTheme } from "../themes/themes";
import { FrontendSettings } from "../models/frontend-settings";
import { catchError } from "rxjs/operators";
import { ErrorMsg } from "../error/error-msg";
import { ServerStatistics } from "../models/server-statistics";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  isDarkTheme: Observable<boolean>;
  isDisplayCovers: Observable<boolean>;
  isDisplaySavePlaylist: Observable<boolean>;
  isSetTabTitle: Observable<boolean>;

  /**
   * Since we want this to be automatically applied, we store it in a subject.
   * Dark theme is default active.
   */
  isDarkTheme$ = new BehaviorSubject(true);

  private isDisplayCovers$ = new BehaviorSubject(true);

  private isDisplaySavePlaylist$ = new BehaviorSubject(true);

  private isSetTabTitle$ = new BehaviorSubject(true);

  constructor(private http: HttpClient, private location: Location) {
    this.isDarkTheme = this.isDarkTheme$.asObservable();
    this.isDisplayCovers = this.isDisplayCovers$.asObservable();
    this.isDisplaySavePlaylist = this.isDisplaySavePlaylist$.asObservable();
    this.isSetTabTitle = this.isSetTabTitle$.asObservable();

    this.setDarkTheme(this.getBoolValue(DARK_MODE_KEY, true));
    this.setDisplayCovers(this.getBoolValue(DISPLAY_COVERS_KEY, true));
    this.setDisplaySavePlaylist(
      this.getBoolValue(DISPLAY_SAVE_PLAYLIST_KEY, true)
    );
    this.setTabTitleOption(this.getBoolValue(SET_TAB_TITLE, true));
  }

  setTabTitleOption(isTabTitle: boolean): void {
    localStorage.setItem(SET_TAB_TITLE, JSON.stringify(isTabTitle));
    this.isSetTabTitle$.next(isTabTitle);
  }

  setDisplaySavePlaylist(isDisplaySavePlaylist: boolean): void {
    localStorage.setItem(
      DISPLAY_SAVE_PLAYLIST_KEY,
      JSON.stringify(isDisplaySavePlaylist)
    );
    this.isDisplaySavePlaylist$.next(isDisplaySavePlaylist);
  }

  setDisplayCovers(isDisplayCovers: boolean): void {
    localStorage.setItem(DISPLAY_COVERS_KEY, JSON.stringify(isDisplayCovers));
    this.isDisplayCovers$.next(isDisplayCovers);
  }

  setDarkTheme(isDarkTheme: boolean): void {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkTheme));
    this.isDarkTheme$.next(isDarkTheme);
    if (isDarkTheme) {
      this.changeTheme(DarkTheme);
    } else {
      this.changeTheme(LightTheme);
    }
  }

  getBoolValue(key: string, defaultValue = false): boolean {
    try {
      const saved: string =
        localStorage.getItem(key) || defaultValue.toString();
      return <boolean>JSON.parse(saved);
    } catch (err) {
      return defaultValue;
    }
  }

  getBackendSettings(): Observable<BackendSettings> {
    const url = `${this.getBackendContextAddr()}api/settings`;
    return this.http.get<BackendSettings>(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError({
          title: `Got an error retrieving the backend settings:`,
          detail: err.message,
        } as ErrorMsg)
      )
    );
  }

  getCoverCacheDiskUsage(): Observable<number> {
    const url = `${this.getBackendContextAddr()}api/cover-disk-usage`;
    return this.http.get<number>(url);
  }

  getCoverBlacklist(): Observable<CoverBlacklistFiles> {
    const url = `${this.getBackendContextAddr()}api/cover-blacklist`;
    return this.http.get<CoverBlacklistFiles>(url);
  }

  blacklistCover(file: string): Observable<void> {
    const url = `${this.getBackendContextAddr()}api/blacklist-cover`;
    return this.http.post<void>(url, file);
  }

  /**
   * Returns the api endpoint of the backend that looks for covers in a directory specified by
   * a directory path.
   */
  getFindDirCoverUrl(): string {
    return `${this.getBackendContextAddr()}api/find-dir-cover`;
  }

  /**
   * Returns the api endpoint of the backend that looks for covers in a directory specified by
   * a track path.
   */
  getFindTrackCoverUrl(): string {
    return `${this.getBackendContextAddr()}api/find-track-cover`;
  }

  getBrowseUrl(path = "/"): string {
    return `${this.getBackendContextAddr()}api/browse?path=${path}`;
  }

  getPlaylistRootUrl(): string {
    return `${this.getBackendContextAddr()}api/playlists/`;
  }

  /**
   * Returns the API-base URL respecting a potential context. For example, if the base href is set to 'ampd' it will
   * return 'example.com/ampd'.
   */
  getBackendContextAddr(): string {
    return `${ApiEndpoints.getBackendAddr()}${this.location.prepareExternalUrl(
      ""
    )}`;
  }

  setBackendAddr(backendAddr: string): void {
    localStorage.setItem(BACKEND_ADDRESS_KEY, backendAddr);
  }

  getFrontendSettings(): FrontendSettings {
    const frontendSettings = new FrontendSettings();
    frontendSettings.isDarkTheme = this.isDarkTheme;
    frontendSettings.isDisplayCovers = this.isDisplayCovers;
    frontendSettings.isDisplaySavePlaylist = this.isDisplaySavePlaylist;
    frontendSettings.isSetTabTitle = this.isSetTabTitle;
    return frontendSettings;
  }

  getServerStatistics(): Observable<ServerStatistics> {
    const url = `${this.getBackendContextAddr()}api/server-statistics`;
    return this.http.get<ServerStatistics>(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError({
          title: `Got an error retrieving the server statistics:`,
          detail: err.message,
        } as ErrorMsg)
      )
    );
  }

  private changeTheme(theme: Map<string, string>): void {
    theme.forEach((value, prop) => {
      document.documentElement.style.setProperty(prop, value);
    });
  }
}
