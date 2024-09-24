import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RadioStreamService } from "../../../service/radio-stream.service";
import { RadioStream } from "../../../shared/model/db/radio-stream";

@Component({
  selector: "app-add-radio-stream",
  templateUrl: "./add-radio-stream.component.html",
  styleUrls: ["./add-radio-stream.component.scss"],
})
export class AddStreamComponent {
  radioStreamForm = new FormGroup({
    name: new FormControl("", Validators.required),

    url: new FormControl("", Validators.required),
  });

  constructor(private radioStreamService: RadioStreamService) {}

  onSubmit(): void {
    this.radioStreamService
      .addRadioStream({
        name: String(this.name.value),
        url: String(this.url.value),
      } as RadioStream)
      .subscribe(() => {
        this.radioStreamForm.reset();
        window.location.reload();
      });
  }

  get name(): FormControl {
    return this.radioStreamForm.get("name") as FormControl;
  }

  get url(): FormControl {
    return this.radioStreamForm.get("url") as FormControl;
  }
}
