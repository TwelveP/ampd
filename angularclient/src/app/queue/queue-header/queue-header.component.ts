import { Component } from "@angular/core";
import { Observable, combineLatest, map, shareReplay, startWith } from "rxjs";
import { MpdService } from "../../service/mpd.service";
import { QueueTrack } from "../../shared/model/queue-track";
import { RadioStreamService } from "./../../service/radio-stream.service";

interface CurrentPlay {
  state: string;
  track: QueueTrack;
}

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent {
  currentPlay: Observable<CurrentPlay>;
  currentPathLink = ""; // encoded dir of the current playing track
  radioStreamName = new Observable<string>().pipe(startWith("")); // If we found a name to the stream url
  isRadioStream: Observable<boolean>;

  constructor(
    private mpdService: MpdService,
    private radioStreamService: RadioStreamService,
  ) {
    this.isRadioStream = this.mpdService.isCurrentTrackRadioStream$();
    this.currentPlay = combineLatest([
      this.mpdService.currentState$.pipe(startWith("stop")),
      this.mpdService.currentTrack$.pipe(startWith({} as QueueTrack)),
    ]).pipe(
      map(([state, track]) => {
        return {
          state: state,
          track: track,
        } as CurrentPlay;
      }),
    );
    this.currentPlay.subscribe((data) => this.processCurrentPlay(data));

    this.handleRadioStream();
  }

  private handleRadioStream(): void {
    this.radioStreamName = combineLatest([
      this.mpdService.currentTrack$,
      this.mpdService.isCurrentTrackRadioStream$().pipe(startWith(false)),
      this.radioStreamService.getRadioStreams().pipe(shareReplay(1)),
    ]).pipe(
      map(([currentTrack, isRadio, radioStreams]) => {
        if (!isRadio) {
          return "";
        }
        const result = radioStreams.find((rs) => rs.url === currentTrack.file);
        return result === undefined ? "" : result.name;
      }),
    );
  }

  private processCurrentPlay(cp: CurrentPlay): void {
    this.currentPathLink = encodeURIComponent(cp.track.dir);
  }
}
