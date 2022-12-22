import { BreakpointObserver } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ResponsiveScreenService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isMobile(): Observable<boolean> {
    return this.breakpointObserver
      .observe(["(max-width: 768px)"])
      .pipe(map((bp) => bp.matches));
  }
}
