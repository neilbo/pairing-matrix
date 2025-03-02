import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { IonInput } from "@ionic/angular";
import { Router, NavigationExtras } from "@angular/router";
import focusOnInput from '../utils/focus-on-input';
import { COPYRIGHT } from '../utils/copyright-text';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  title: string = "Pairing Matrix Generator";
  names: string;
  team: { names: string; action: string };
  copyright: string;
  useStaticLogo: boolean = false;
  @ViewChild("inputToFocus", { static: false }) namesInput: IonInput;
  constructor(public router: Router) {
    this.team = {
      names:
        "Tony, Steve, Thor, Nat, Bruce, Clint, Wanda, Vis, Sam, Rhodey, Carol, T'Chala",
      action: "Avengers Assemble!"
    };
  }

  async doIt() {
    let names: NavigationExtras = { state: { names: this.names } }
    try {
      await this.router.navigate(["/generator"], names);
      this.names = "";
    } catch (error) {
      console.error(error);
    }
  }

  ngAfterViewInit() {
    this.names = "";
    focusOnInput(this.namesInput);
    this.copyright = COPYRIGHT;
  }

  toggleLogo(currentLogo: string) {
    if (currentLogo === "animated") {
      this.useStaticLogo = true;
    } else {
      this.useStaticLogo = false;
    }
  }
}
