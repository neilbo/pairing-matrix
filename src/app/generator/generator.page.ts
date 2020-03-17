import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonInput } from "@ionic/angular";
import focusOnInput from "../utils/focus-on-input";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { COPYRIGHT } from '../utils/copyright-text';

@Component({
  selector: "app-generator",
  templateUrl: "./generator.page.html",
  styleUrls: ["./generator.page.scss"]
})
export class GeneratorPage implements AfterViewInit {
  title: string = "Pairing Matrix Generator";
  names: string;
  teamName: string;
  iteration: number;
  // colors
  bgForPrimary: any;
  colorForLine: any;
  colorForText: any;
  bgForMatched: any;
  // 
  members: string[];
  rowHeader: any;
  columnHeader: any;
  spaces: string[];
  //
  columns: Array<[]>;
  _names: Array<{ text: string }>;
  header: any;
  _columns: any;
  i;
  j;
  hex;
  copyright: string;
  @ViewChild("inputToFocus", { static: false }) namesInput: IonInput;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.getState();
  }

  getState() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.names = this.router.getCurrentNavigation().extras.state.names;
      }
    });
  }

  ngAfterViewInit() {
    focusOnInput(this.namesInput);
    this.defaultColors();
    this.copyright = COPYRIGHT;
  }

  goHome(): void {
    this.router.navigateByUrl("home");
  }

  onColorChange(color: CustomEvent, ref: string): void {
    switch (ref) {
      case "primary":
        this.bgForPrimary = color;
        this.drawTable();
        break;
      case "line":
        this.colorForLine = color;
        this.drawTable();
        break;
      case "text":
        this.colorForText = color;
        this.drawTable();
        break;
      case "matched":
        this.bgForMatched = color;
        break;
      default:
        console.error(`Error: ${color} for ${ref} Failed`);
    }
    console.log("%c Color changed:", `color: ${color}`);
  }

  defaultColors(): void {
    this.bgForPrimary = "#1A73E8";
    this.colorForText = "#ffffff";
    this.bgForMatched = "#a9a9a9";
    this.colorForLine = "#c0c0c0";
  }

  preview() {

    const doc = new jsPDF("l", "pt", [595.28, 841.89]); //landscape,measure using pts, a4 dimensions
    doc.setFontSize(18);
    doc.textWithLink(`pairingmatrix.com`, 340, 55, { url: 'https://www.pairingmatrix.com' }, null, "center");

    if (this.teamName) {
      doc.setFontSize(16);
      doc.text(`${this.teamName}`, 45, 75);
    }

    if (this.iteration) {
      doc.setFontSize(12);
      doc.text(`Iteration: ${this.iteration}`, 45, 95);
    }

    doc.autoTable({
      startY: 115,
      head: [this.header],
      body: this.columns,
      styles: { cellPadding: 8, fontSize: 12 }
    });
    if (this.teamName) {
      doc.setFontSize(10);
      doc.text(`Pairing Matrix Generator`, 350, doc.autoTable.previous.finalY + 30);
    }
    var string = doc.output('dataurlnewwindow');
    var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    var x = window.open();
    x.document.open();
    x.document.write(embed);
    x.document.close();
  }
 
  download() {
    const doc = new jsPDF("l", "pt", [595.28, 841.89]); //landscape,measure using pts, a4 dimensions
    doc.setFontSize(18);
    doc.textWithLink(`pairingmatrix.com`, 340, 55, { url: 'https://www.pairingmatrix.com' }, null, "center");

    if (this.teamName) {
      doc.setFontSize(16);
      doc.text(`${this.teamName}`, 45, 75);
    }

    if (this.iteration) {
      doc.setFontSize(12);
      doc.text(`Iteration: ${this.iteration}`, 45, 95);
    }

    doc.autoTable({
      startY: 115,
      head: [this.header],
      body: this.columns,
      styles: { cellPadding: 8, fontSize: 12 }
    });
    if (this.teamName) {
      doc.setFontSize(10);
      doc.text(`Pairing Matrix Generator`, 350, doc.autoTable.previous.finalY + 30);
    }
    doc.save("i-love-pairing-matrix.pdf");
  }
  // Table
  isNamesEmpty(): boolean {
    return this.names === null || this.names === undefined || this.names === "";
  }

  onNamesChange() {
    this.members = this.names.split(", ");
    this._names = this.members.map(name => {
      return { text: name };
    });
    this.rowHeader = [{ text: "Names" }, ...this._names];
    this._columns = [{ text: "Names" }, ...this._names].reverse();
    this.spaces = [...this.members];
    this.columnHeader = this.members.reverse();
    this.drawTable();
  }

  setBackground(i: number, j: number): string {
    const isMatch = i + j === this.spaces.length - 1;
    const isHidden = i + j > this.spaces.length - 1;
    if (i === undefined || j === undefined) {
      return this.bgForPrimary || "black";
    }
    if (isMatch) {
      return this.bgForMatched || "darkgrey";
    }
    if (isHidden) {
      return "#f4f4f4";
    }
  }

  setBorder(i: number, j: number): string {
    const isVisible = i + j <= this.spaces.length - 1
    const isMatch = i + j === this.spaces.length - 1;
    const isHidden = i + j > this.spaces.length - 1;
    // console.log(`${i}, ${j}`)
    if (i === undefined || j === undefined) {
      return `1px solid ${this.colorForLine}`;
    }
    if (isVisible) {
      return `1px solid ${this.colorForLine}`;
    }
    if (isMatch) {
      return `1px solid ${this.colorForLine};`;
    }
    if (isHidden) {
      return "none";
    }
  }

  setTextColor() {
    return this.colorForText;
  }

  resetForm() {
    this.names = "";
    this.teamName = "";
    this.iteration = null;
    this.rowHeader = [];
    this.spaces = [];
    this.columnHeader = [];
    this.defaultColors();
  }
  // PDF Table
  drawTable() {
    this.columns = this._columns.map(i => {
      return this.rowHeader.map(j => {
        let styleForFirst = this.rowHeader.indexOf(j) === 0;
        let styleMatch =
          this._columns.indexOf(i) + this.rowHeader.indexOf(j) ===
          this.rowHeader.length - 1;
        let styleHidden =
          this._columns.indexOf(i) + this.rowHeader.indexOf(j) >=
          this.rowHeader.length - 1;
        let coords = `${this._columns.indexOf(i)}, ${this.rowHeader.indexOf(
          j
        )}`;
        if (styleForFirst) {
          return {
            content: `${i.text}`,
            styles: {
              halign: "center",
              fillColor: this.bgForPrimary,
              textColor: this.colorForText,
              fontStyle: "bold",
              lineColor: this.colorForLine,
              lineWidth: 1,
              minCellWidth: 80,
            }
          };
        }
        if (styleMatch) {
          return {
            content: ``,
            styles: {
              halign: "center",
              fillColor: this.bgForMatched,
              textColor: this.colorForText,
              lineColor: this.colorForLine,
              lineWidth: 0.5,
              minCellWidth: 80
            }
          };
        }
        if (styleHidden) {
          return {
            content: ``,
            styles: { halign: "center", fillColor: "white", minCellWidth: 80 }
          };
        }
        return {
          content: ``,
          styles: {
            halign: "center",
            fillColor: "white",
            lineColor: this.colorForLine,
            lineWidth: 0.5,
            minCellWidth: 80
          }
        };
      });
    });
    // this.columns.reverse().pop();
    this.columns.pop();
    console.table(this.columns)
    this.header = this.rowHeader.map(h => {
      // console.info(`h: ${h}`);
      return {
        content: h.text,
        styles: {
          halign: "center",
          fillColor: this.bgForPrimary,
          textColor: this.colorForText,
          lineColor: this.colorForLine,
          lineWidth: 0.5
        }
      };
    });
  }
  focusOnInput() {
    focusOnInput(this.namesInput);
  }
}


