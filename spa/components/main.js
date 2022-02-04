import html from "html-literal";
import * as views from "../views";

export default (state, view) => {
  console.log('matsinet-state : Main Component', state);
  console.log('matsinet-view', view);
  return html`
    ${view.render(state)}
  `;
}