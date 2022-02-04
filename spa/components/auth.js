import html from "html-literal";

export default state => html`
  ${ ! state.isLoggedIn ? `<a class="ui item" data-navigo>
    Login
  </a>` : ''}
  ${state.isLoggedIn ? `<a class="ui item" data-navigo>
    Logout
  </a>` : ''}
`;