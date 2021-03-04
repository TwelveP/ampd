import {MpdTrack} from "../messages/incoming/mpd-track";

/**
 * A queue track represents a track in the track table of the queue.
 * It's based on a MpdTrack as defined in the javampd library but has some attributes added.
 */
export class QueueTrack implements MpdTrack {
  albumName = "";
  artistName = "";
  comment = "";
  discNumber = "";
  file = "";
  genre = "";
  id = 0;
  length = 0;
  name = "";
  position = 0;
  title = "";
  track = 0;
  year = "";

  // QueueTrack properties
  coverUrl = "";
  elapsed = 0; // elapsed time
  playing = false; // if the track is currently played
  progress = 0; // progress in seconds
  changed = false; // is this a new track
  dir = ""; // the directory of this track

  constructor(currentTrack?: MpdTrack) {
    if (currentTrack) {
      this.albumName = currentTrack.albumName;
      this.artistName = currentTrack.artistName;
      this.comment = currentTrack.comment;
      this.discNumber = currentTrack.discNumber;
      this.file = currentTrack.file;
      this.genre = currentTrack.genre;
      this.id = currentTrack.id;
      this.length = currentTrack.length;
      this.name = currentTrack.name;
      this.position = currentTrack.position;
      this.title = currentTrack.title;
      this.track = currentTrack.track;
      this.year = currentTrack.year;
    }
  }
}
