import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { distinctUntilChanged, map } from "rxjs/operators";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { SettingsService } from "../../service/settings.service";
import { AlbumCoverDialogComponent } from "../../shared/album-cover-dialog/album-cover-dialog.component";
import { QueueTrack } from "../../shared/model/queue-track";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.scss"],
  standalone: false,
})
export class TracksComponent implements OnInit {
  @Input() tracks: QueueTrack[] = [];
  coverUrl = "";
  dirQp = "/";
  queueDuration = 0;
  trackTableData = new TrackTableOptions();
  validCoverUrl = false;
  private isMobile = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private responsiveScreenService: ResponsiveScreenService,
    private settingsService: SettingsService,
  ) {
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => (qp.get("dir") as string) || "/"),
        distinctUntilChanged(),
      )
      .subscribe((dir) => (this.dirQp = decodeURIComponent(dir)));
  }

  ngOnInit(): void {
    this.trackTableData = this.buildTableData();
    this.queueDuration = this.sumTrackDuration();
    this.coverUrl = `${this.settingsService.getFindDirCoverUrl()}?path=${encodeURIComponent(
      this.dirQp,
    )}`;
  }

  openCoverDialog(coverUrl: string): void {
    this.dialog.open(AlbumCoverDialogComponent, {
      data: coverUrl,
    });
  }

  onError(): void {
    this.validCoverUrl = false;
  }

  onLoad(): void {
    this.validCoverUrl = true;
  }

  private buildTableData(): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.dataSource = new MatTableDataSource<QueueTrack>(this.tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.pageSize = this.tracks.length;
    trackTable.totalElements = this.tracks.length;
    trackTable.totalPages = 1;
    trackTable.showPageSizeOptions = false;
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artist-name", showMobile: true },
      { name: "album-name", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "play-title", showMobile: false },
      { name: "add-title", showMobile: false },
      { name: "info", showMobile: false },
    ];
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  /**
   * Calculate the sum of all track durations.
   */
  private sumTrackDuration(): number {
    let ret = 0.0;
    for (const item of this.trackTableData.dataSource.data) {
      ret += item.length;
    }
    return ret;
  }
}
