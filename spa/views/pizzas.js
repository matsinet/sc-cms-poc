import html from "html-literal";
import axios from "axios";

const render = (state = {}) => html`
  <h2>List of Pizzas</h2>
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
  <hr>
  <h2>Order a pizza</h2>
  <form id="order" method="POST" action="">
    <div>
      <label for="crust">Crust:</label>
      <select id="crust" name="crust">
        <option value="">Select a Crust</option>
        <option value="Thin">Thin</option>
        <option value="Chicago">Chicago</option>
        <option value="Deep Dish">Deep Dish</option>
        <option value="Thick">Thick</option>
        <option value="Hella Thick">Hella Thick</option>
      </select>
    </div>
    <div>
      <label for="cheese">Cheese:</label>
      <input
          type="text"
          name="cheese"
          id="cheese"
          placeholder="Enter Cheese"
          required
      />
    </div>
    <div>
      <label for="sauce">Sauce:</label>
      <input
          type="text"
          name="sauce"
          id="sauce"
          placeholder="Enter Sauce"
          required
      />
    </div>
    <div>
      <label for="toppings">Toppings:</label>
      <input
          type="checkbox"
          id="id_of_checkbox1"
          class="items1"
          name="toppings"
          value="Chicken"
      />
      <label for="top1">Chicken</label>
      <input
          type="checkbox"
          id="id_of_checkbox2"
          class="items1"
          name="toppings"
          value="Onion"
      />
      <label for="top2">Onion</label>
      <input
          type="checkbox"
          id="id_of_checkbox3"
          class="items1"
          name="toppings"
          value="Spinach"
      />
      <label for="top3">Spinach</label>
      <input
          type="checkbox"
          id="id_of_checkbox4"
          class="items1"
          name="toppings"
          value="Extra cheese"
      />
      <label for="top4">Extra Cheese</label>
      <input
          type="checkbox"
          id="id_of_checkbox5"
          class="items1"
          name="toppings"
          value="Red Pepper"
      />
      <label for="top5">Red Pepper</label>
    </div>
    <input type="hidden" name="customer" id="customer" value="Matt T" />
    <input type="submit" name="submit" value="Submit Pizza" />
  </form>
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
  },
  after: async () => {
    document.querySelector("form").addEventListener("submit", async event => {
      event.preventDefault();

      const inputList = event.target.elements;

      const toppings = [];
      // Interate over the toppings input group elements
      for (let input of inputList.toppings) {
        // If the value of the checked attribute is true then add the value to the toppings array
        if (input.checked) {
          toppings.push(input.value);
        }
      }

      const requestData = {
        customer: inputList.customer.value,
        crust: inputList.crust.value,
        cheese: inputList.cheese.value,
        sauce: inputList.sauce.value,
        toppings: toppings
      };

      return await axios
        .post(`${process.env.PIZZA_PLACE_API_URL}/pizzas`, requestData)
        .then(response => {
          // Push the new pizza onto the Pizza state pizzas attribute, so it can be displayed in the pizza list
          return {
            pizzas: response.data
          };
          // TODO: How do we do redirects now with JavaScript in the view
          //router.navigate("/Pizzas");
        })
        .catch(error => {
          console.log("It puked", error);
        });
    });
  }
};

export default {
  render,
  hooks
}