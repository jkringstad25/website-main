document.addEventListener("DOMContentLoaded", function () {
    "use strict"; 

        //SHOW COOKIE BAR
        function showCookieBar() {
            document.getElementById("policy-bar").classList.add("open");
        }
        function hideCookieBar() {
            document.getElementById("policy-bar").classList.remove("open");
        }
        function showCookieMessage() {
            document.getElementById("policy-message").classList.add("open");
        }
        function hideCookieMessage() {
            document.getElementById("policy-message").classList.remove("open");
        }
    
        // --- Event bindings ---
        document.getElementById("close-policy-message")?.addEventListener("click", hideCookieMessage);
        document.getElementById("close-policy-bar")?.addEventListener("click", hideCookieBar);

        showCookieBar();

        // HAMBURGER MENU ANIMATION
        document.getElementById("hamburger").addEventListener("click", function () {
          this.classList.toggle("open");
        });


        // TRIGGER NAVBAR BACKGROUND ON SCROLL -------------------------------------------------------------------------------------------------------
        window.addEventListener("scroll", function () {
          const navbar = document.querySelector(".navbar-dark");
          const value = window.scrollY;
          if (value > window.innerHeight) {
            navbar.classList.add("scrolled");
          } else {
            navbar.classList.remove("scrolled");
          }
        });
   
        // LOAD SCRIPTS FOR GAME PAGE
        if (document.body.classList.contains("game-page")) {

            // TRIGGER ANIMATION WHEN ELEMENT IS IN VIEW ------------------------------------------------------------------------------------------------
            function initAnimations() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                        }
                    });
                }, { threshold: 0.5 });

                // Observe all elements that should animate
                document.querySelectorAll('.animation-element').forEach(el => observer.observe(el));
            }

            // AGE CHECKER -------------------------------------------------------------------------------------------------------------------------------
            function setStorage(key, value, days = 30) {
                try {
                    const expiry = Date.now() + days * 24 * 60 * 60 * 1000;
                    const data = JSON.stringify({ value, expiry });
                    localStorage.setItem(key, data);
                } catch {
                    // Fallback to cookie with expiry
                    let expires = "";
                    if (days) {
                        let date = new Date();
                        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                        expires = "; expires=" + date.toUTCString();
                    }
                    document.cookie = key + "=" + encodeURIComponent(value) + expires + "; path=/";
                }
            }
            
            function getStorage(key) {
                try {
                    const data = localStorage.getItem(key);
                    if (!data) return null;
                    const parsed = JSON.parse(data);
                    if (Date.now() > parsed.expiry) {
                        localStorage.removeItem(key);
                        return null;
                    }
                    return parsed.value;
                } catch {
                    // Fallback to cookie (no expiry check here, browser handles it)
                    const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
                    return match ? decodeURIComponent(match[2]) : null;
                }
            }

            // Check if user has already passed the age check
            const ageChecker = () => {
                if (getStorage("ageVerified") === "true") {
                    document.getElementById("age-checker-wrapper").style.display = "none";
                    document.getElementById("age-checker-overlay").style.display = "none";
                    console.log("Age verified status:", getStorage("ageVerified"));
                    initAnimations();
                    return; // Skip showing the form
                }
            
                document.getElementById("age-form").addEventListener("submit", function (e) {
                    e.preventDefault();
                    const birthYear = parseInt(document.getElementById("birthYear").value);
                    const currentYear = new Date().getFullYear();
                    const age = currentYear - birthYear;
                    const result = document.getElementById("result");
            
                    if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
                        result.innerHTML = "<span class='text-danger'>Please enter a valid year.</span>";
                        return;
                    }
            
                    if (age >= 17) {
                        document.getElementById("age-checker-wrapper").style.display = "none";
                        document.getElementById("age-checker-overlay").style.display = "none";
            
                        // Save verified status with 30-day expiry
                        setStorage("ageVerified", "true", 30);
            
                        // Start animations after passing age check
                        initAnimations();
                    } else {
                        result.innerHTML = `<span class="text-danger">Sorry, you must be at least 17 years old to enter</span>`;
                    }
                });
            };
            
            // Run Age Checker
            ageChecker();
            
          // FEATURES SECTION CAROUSEL ----------------------------------------------------------------------------------------------------------------
          var carousel = document.getElementById("features-carousel");
          var progressBar = document.querySelector(".carousel-progress .progress-bar");
          var interval = 8000; // Set features carousel interval

          function startProgressBar() {
              progressBar.style.transition = "none";
              progressBar.style.width = "0%";
              setTimeout(() => {
                  progressBar.style.transition = `width ${interval}ms linear`;
                  progressBar.style.width = "100%";
              }, 10);
          }

          var myCarousel = new bootstrap.Carousel(carousel, {
              interval: interval,
              ride: "carousel",
              pause: "false",
          });

          carousel.addEventListener("slide.bs.carousel", function () {
              startProgressBar();
          });

          startProgressBar(); // Start progress bar initially
      

          // CHARACTERS SECTION CAROUSEL --------------------------------------------------------------------------------------------------------------------
          const splide = new Splide('#characterCarousel', {
            type: 'loop',
            perPage: 2,
            perMove: 1,
            gap: '0px',
            breakpoints: {
              768: {
                perPage: 1,
              },
            },
            focus: 'left',
            arrows: true,
          });

          splide.mount();

          function updateDescription() {
            const slides = splide.Components.Slides.get();
            const currentIndex = splide.index;
            const activeSlide = slides[currentIndex].slide;
            const characterImg = activeSlide.querySelector('.character');

            const titleSpan = document.getElementById("titleSpan");
            const descriptionText = document.getElementById("descriptionText");

            if (characterImg) {
              const name = characterImg.getAttribute("data-name") || "SAMURAI";
              const text = characterImg.getAttribute("data-text") || "Hover over a character to learn more.";

              descriptionText.style.opacity = 0;

              setTimeout(() => {
                titleSpan.textContent = name;
                descriptionText.textContent = text;
                descriptionText.style.opacity = 1;
              }, 200);
            }
          }

          // Run once on mount
          updateDescription();

          // Update when slide changes
          splide.on('move', updateDescription);

          
          // LIGHTBOX -------------------------------------------------------------------------------------------------------------------------------------
          const lightbox = GLightbox({
              selector: '.glightbox',
              touchNavigation: true,
              loop: true,
              autoplayVideos: true
          });

          // Add click handlers to buttons
          document.querySelectorAll(".lightbox-button").forEach(button => {
              button.addEventListener("click", function () {
                  const target = this.getAttribute("data-target");
                  const firstImage = document.querySelector(`a[data-gallery="${target}"]`);
                  if (firstImage) {
                      firstImage.click();
                  }
              });
          });
      }

        //COPYRIGHT YEAR ------------------------------------------------------------------------------------------------------------------------------
        var date = new Date().getFullYear();
        document.getElementById("year").innerHTML = date;

});

window.onload = function() {

      // LOAD SCRIPTS FOR GAME PAGE
      if (document.body.classList.contains("game-page")) {
        // HIDE LOADING SCREEN WHEN PAGE IS LOADED ----------------------------------------------------------------------------------------------------
        const progress = document.getElementById('progress');
        const loaderWrapper = document.getElementById('loader-wrapper');

        // Animate the width to 100%
        progress.style.transition = 'width 0.3s linear';
        progress.style.width = '100%';

        // When the animation finishes, add the class
        progress.addEventListener('transitionend', function handler() {
            loaderWrapper.classList.add('content-loaded');
            // Remove the event listener so it only runs once
            progress.removeEventListener('transitionend', handler);
        });
    }
}