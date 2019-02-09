filePicker.addEventListener('change', function () {
  let viz = document.getElementById("messages_viz");

  // TODO fix latency on the animation caused by doing computationally expensive
  // tasks at the same time
  viz.innerHTML = `
  <text x="20" y="35" class="small">Loading</text>
  <circle fill="blue" cx="20" cy="50" r="5" >
    <animate attributeName="opacity" from="0" to="1"
    dur="3s" repeatCount="indefinite" />
    </circle>
    
    <circle fill="blue" cx="40" cy="50" r="5" >
    <animate attributeName="opacity" from="0" to="1"
    begin="1s" dur="3s" repeatCount="indefinite" />
    </circle>
    
    <circle fill="blue" cx="60" cy="50" r="5" >
    <animate attributeName="opacity" from="0" to="1"
    begin="2s" dur="3s" repeatCount="indefinite" />
  </circle>`

});