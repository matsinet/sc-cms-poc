import html from "html-literal";
import logo from "../assets/img/logo.png"
import axios from "axios";

const render = (state = {}) => html`
  <div>
    <img src="${logo}" alt="${state.tabTitle} Logo" class="logo">
  </div>
`;

const hooks = {
  before: async (state = {}) => {
    console.log("Component beforeHook fired");
  },
  after: async (state = {}) => {
    console.log("Component afterHook fired");
    document.querySelector('img').alt = "Savvy Coders Rocks";
    return {
      afterHook: "home"
    };
  }
}

export default {
  render,
  hooks
}

