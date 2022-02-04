import html from "html-literal";
import * as views from "../views";

export default (state, view) => {
  return html`
    ${view.render(state)}
  `;
}