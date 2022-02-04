import html from 'html-literal';
import { Auth } from '../components';

export default state => html`
  <div class="ui fixed menu">
    <a class="header item" href="/" data-navigo>
      Cohort Management System
    </a>
    <a class="item" href="/pizzas" data-navigo>
      Pizza List
    </a>
    <div class="right menu">
      <a class="item" href="/admin" data-navigo>
        Admin
      </a>
    </div>
  </div>
`