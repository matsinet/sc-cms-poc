import html from "html-literal";

export default () => html`
  <div class="allDayColumn column">
    <div class="inline field">
      <label for="startTime">Start Time</label>
      <input type="time" name="startTime" id="startTime">
    </div>
  </div>
  <div class="allDayColumn column">
    <div class="inline field">
      <label for="endTime">End Time</label>
      <input type="time" name="endTime" id="endTime">
    </div>
  </div>
`;