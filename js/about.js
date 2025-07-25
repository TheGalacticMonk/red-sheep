// about.js or <script> in partial
document.addEventListener("DOMContentLoaded", function() {
    // If this is in a partial, wrap in setTimeout to wait for DOM injection
    setTimeout(function() {
      const textEl = document.getElementById('terminalText');
      if (!textEl) return;
  
      // Use \n for line breaks, or <br> for HTML breaks
      const paragraph = [
        "Wake up Neo...",
        "",
        "We are Red Sheep Agency.",
        "",
        "We see you following the herd...",
        "",
        "And not stepping into your fullest power...",
        "",
        "We know you're wondering what a Red Sheep is...",
        "",
        "We are indeed similar to the Black Sheep in many ways...",
        "",
        "But the Red Sheep doesn't just stand out from the crowd...",
        "",
        "We are the ones who break the rules.",
        "",
        "The wolf no longer sees the Red Sheep as prey...",
        "",
        "But instead a danger zone; a disruptor of all systems.",
        "",
        "You are a Red Sheep...",
        "",
        "Aren't you Neo???"
      ];
  
      let i = 0;
      let line = 0;
      let content = "";
  
      function type() {
        if (line >= paragraph.length) return; // Done
  
        if (i <= paragraph[line].length) {
          textEl.innerHTML = content + paragraph[line].slice(0, i) + '<span class="cursor"></span>';
          i++;
          setTimeout(type, 44); // typing speed
        } else {
          content += paragraph[line] + "<br>";
          i = 0;
          line++;
          setTimeout(type, 333); // pause between lines
        }
      }
  
      type();
    }, 100);
  });
  