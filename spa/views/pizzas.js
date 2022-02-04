import html from "html-literal";
import axios from "axios";

const render = (state = {}) => html`
  <table id="pizzas">
    <tr>
      <th>Crust</th>
      <th>Cheese</th>
      <th>Sauce</th>
      <th>Toppings</th>
      <th>Customer</th>
    </tr>
    ${state.pizzas
      .map(pizza => {
        return `<tr><td>${pizza.crust}</td><td>${pizza.cheese}</td><td>${
          pizza.sauce
        }</td><td>${pizza.toppings.join(" & ")}</td><td>${
          pizza.customer
        }</td></tr>`;
      })
      .join("")}
  </table>
`;

const hooks = {
  before: async (state = {}) => {
    console.log("Component beforeHook fired");
    return await axios.get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`)
      .then(response => {
        return {
          pizzas: response.data
        }
      });
  }
};

export default {
  render,
  hooks
}