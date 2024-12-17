import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, map } from "rxjs";
import { AlbumsService } from "src/app/service/albums.service";
import { QueueService } from "src/app/service/queue.service";
import { Track } from "src/app/shared/messages/incoming/track";
import { MpdAlbum } from "src/app/shared/model/http/album";
import { ClickActions } from "src/app/shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "src/app/shared/track-table-data/track-table-options";

@Component({
  selector: "app-album-dialog",
  templateUrl: "./album-dialog.component.html",
  styleUrls: ["./album-dialog.component.scss"],
  standalone: false,
})
export class AlbumDialogComponent {
  trackTableData$: Observable<TrackTableOptions>;
  private isMobile = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public album: MpdAlbum,
    private albumService: AlbumsService,
    private queueService: QueueService,
    public dialogRef: MatDialogRef<AlbumDialogComponent>,
  ) {
    this.trackTableData$ = this.albumService
      .getAlbum(this.album.name, this.album.albumArtist)
      .pipe(map((tracks) => this.buildTrackTableOptions(tracks)));
  }

  onAddDir(): void {
    this.queueService.addAlbum(this.album.albumArtist, this.album.name);
    this.dialogRef.close();
  }

  onPlayDir(): void {
    this.queueService.playAlbum(this.album.albumArtist, this.album.name);
    this.dialogRef.close();
  }

  private buildTrackTableOptions(tracks: Track[]): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.addTracks(tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.totalElements = tracks.length;
    trackTable.pageSize = tracks.length;
    trackTable.showPageSizeOptions = false;
    trackTable.sortable = false;
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artist-name", showMobile: true },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "play-title", showMobile: false },
      { name: "add-title", showMobile: false },
    ];

    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}
