document.addEventListener("DOMContentLoaded", function() {
    document.body.style.opacity = 0;
    setTimeout(function() {
      document.body.style.transition = "opacity 1s ease-in-out";
      document.body.style.opacity = 1;
    }, 100);
  });

