import html from "html-literal";

export default () => html`
  <div class="daysOfWeekColumn column">
    <div class="daysOfWeek ui checkbox">
      <input type="checkbox" name="daysOfWeek" id="sunday" data-index="0">
      <label for="sunday">Sunday</label>
    </div>
  </div>
  <div class="daysOfWeekColumn column">
    <div class="daysOfWeek ui checkbox">
      <input type="checkbox" name="daysOfWeek" id="monday" data-index="1">
      <label for="monday">Monday</label>
    </div>
  </div>
  <div class="daysOfWeekColumn column">
    <div class="daysOfWeek ui checkbox">
      <input type="checkbox" name="daysOfWeek" id="tuesday" data-index="2">
      <label for="tuesday">Tuesday</label>
    </div>
  </div>
  <div class="daysOfWeekColumn column">
    <div class="daysOfWeek ui checkbox">
      <input type="checkbox" name="daysOfWeek" id="wednesday" data-index="3">
      <label for="wednesday">Wednesday</label>
    </div>
  </div>
  <div class="daysOfWeekColumn column">
    <div class="daysOfWeek ui checkbox">
      <input type="checkbox" name="daysOfWeek" id="thursday" data-index="4">
      <label for="thursday">Thursday</label>
    </div>
  </div>
  <div class="daysOfWeekColumn column">
    <div class="daysOfWeek ui checkbox">
      <input type="checkbox" name="daysOfWeek" id="friday" data-index="5">
      <label for="friday">Friday</label>
    </div>
  </div>
  <div class="daysOfWeekColumn column">
    <div class="daysOfWeek ui checkbox">
      <input type="checkbox" name="daysOfWeek" id="saturday" data-index="6">
      <label for="saturday">Saturday</label>
    </div>
  </div>
`;