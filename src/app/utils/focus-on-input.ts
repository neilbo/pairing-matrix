import { IonInput } from "@ionic/angular";

export default function focusOnInput(input: IonInput): void {
  setTimeout(() => {
    input.setFocus();
  }, 1200);
}
