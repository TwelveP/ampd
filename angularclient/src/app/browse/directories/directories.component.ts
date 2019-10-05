import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Directory } from '../../shared/messages/incoming/directory';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { BrowseService } from '../../shared/services/browse.service';
import { NotificationService } from '../../shared/services/notification.service';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
  selector: 'app-directories',
  templateUrl: './directories.component.html',
  styleUrls: ['./directories.component.css'],
})
export class DirectoriesComponent {
  @Input() public dirQueue: Directory[] = [];
  public getParamDir = '';

  constructor(
    private browseService: BrowseService,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  @HostListener('click', ['$event'])
  public onDirClick(directory: string): void {
    if (event) {
      event.stopPropagation();
    }

    console.log(`Clicked on ${directory}`);

    this.browseService.sendBrowseReq(directory);
    const splittedPath: string = this.splitDir(directory);
    const targetDir: string = this.getParamDir
      ? this.getParamDir + '/' + splittedPath
      : splittedPath;
    this.router.navigate(['browse'], { queryParams: { dir: directory } });
  }

  /**
   * Returns the last element of a path.
   * @param {string} dir
   * @returns {string}
   */
  public splitDir(dir: string): string {
    const splitted: string =
      dir
        .trim()
        .split('/')
        .pop() || '';
    return splitted;
  }
}
