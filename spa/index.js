import { header, main, footer } from "./components";
import * as store from "./store";
import * as views from "./views";
import Navigo from "navigo";
import { lowerCase, merge } from "lodash";
import dotenv from "dotenv";

dotenv.config();

const router = new Navigo("/");

function render(state, view) {
  document.title = state.tabTitle || store.global.tabTitle;
  document.querySelector("#root").innerHTML = `
  ${header(state)}
  ${main(state, view)}
  ${footer(state)}
`;

  router.updatePageLinks();
}

function getViewNameFromParams(params) {
  let view = "home";
  if (params && params.data && params.data.hasOwnProperty("view")) {
    view = lowerCase(params.data.view);
  }
  return view;
}

function pageNotFound() {
  // This should render a 404 page instead of home
  render(merge(store.global, store.home), views[store.home.view]);
}

router.hooks({
  before: (done, params) => {
    let view = getViewNameFromParams(params);

    if (! (view in views)) {
      console.warn("View not found exiting beforeHook");
      done();
    }

    if ('hooks' in views[view] && 'before' in views[view].hooks) {
      views[view].hooks.before(store[view])
        .then(data => {
          merge(store[view], data);
          done();
        });
    } else {
      console.log("No component beforeHook found!");
      done();
    }
  },
  after: (params) => {
    let view = getViewNameFromParams(params);

    if (! (view in views)) {
      return;
    }

    if ('hooks' in views[view] && 'after' in views[view].hooks) {
      views[view].hooks.after(store[view])
        .then(data => {
          merge(store[view], data);
        });
    } else {
      console.log("No component afterHook found!");
    }
  }
});

router.notFound(
  () => {
    console.warn("Not Found route being hit");
    pageNotFound();
  }
);

router
  .on({
    "/": () => render(merge(store.global, store.home), views[store.home.view]),
    "/:view": params => {
      let view = lowerCase(params.data.view);

      if (! (view in views)) {
        console.warn("View not found displaying 404 page");
        pageNotFound();
        return;
      }

      render(merge(store.global, store[view]), views[view]);
    }
  })
  .resolve();
