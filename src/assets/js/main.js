(function ($) {
  "use strict";

  $('.tab-link').click(function () {

    var tabID = $(this).attr('data-tab');

    $(this).addClass('active').siblings().removeClass('active');

    $('#tab-' + tabID).addClass('active').siblings().removeClass('active');
  });

  /* ========================== 
  Select2 Init 
  ==========================*/
  $(document).ready(function () {
    $('.destination-select').select2();
  });

  /***********
  Preloder js
  ************/
  jQuery(window).on('load', function () {
    $(".preloader").delay(1600).fadeOut("slow");
  });

  /* ========================== 
   Daterange Init
   ==========================*/
  $('input[name="daterange"]').daterangepicker({
    opens: 'left',
    minDate: moment(),
  }, function (start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
  });

  $('input[name="booking"]').daterangepicker({
    singleDatePicker: true,

  });
  $('input[name="daterange"]').val('');
  $('input[name="daterange"]').attr("placeholder", "Select Date");


  //   $('input[name="date_form"]').daterangepicker({
  //     singleDatePicker: true,
  //     // showDropdowns: true,
  //     minDate: moment(),
  //     autoApply: false,
  //     locale: {
  //         format: 'MM/DD/YYYY',
  //     }
  // });
  // $('input[name="date_form"]').val('');
  // $('input[name="date_form"]').attr("placeholder","Select Date");

  /* ========================== 
     Accordion Js
     ==========================*/
  $('.toggle').click(function (e) {
    e.preventDefault();

    let $this = $(this);

    if ($this.next().hasClass('show')) {
      $this.next().removeClass('show');
      $this.next().slideUp(350);
    } else {
      $this.parent().parent().find('.single__accordion .inner').removeClass('show');
      $this.parent().parent().find('.single__accordion .inner').slideUp(350);
      $this.next().toggleClass('show');
      $this.next().slideToggle(350);
    }
  });


  /* ========================== 
      Sticky Header
     ==========================*/
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 20) {
      $(".header-style").addClass("sticky");
    } else {
      $(".header-style").removeClass("sticky");
    }
  });

  /* ========================== 
     Jarallax Js
     ==========================*/
  jarallax(document.querySelectorAll(".jarallax"));


  /* ========================== 
     WOW JS
     ==========================*/
  function wowAnimation() {
    new WOW({
      offset: 100,
      animateClass: "animated",
      mobile: true,
    }).init();
  }

  jQuery(window).on('load', function () {
    wowAnimation();
  });



  /* ========================== 
     Navbar JS
     ==========================*/
  const menuLinks = document.querySelectorAll('.nav-link.nav-link-sm.has-dropdown');
  const dropdownMenus = document.querySelectorAll('.nav-dropdown-sm');
  const hamburgerBtn = document.getElementById('hamburger')
  const mobileMenu = document.getElementById('mobile-menu')

  hamburgerBtn && hamburgerBtn.addEventListener('click', () => {
    if (!(hamburgerBtn.classList.contains('hum-active'))) {
      hamburgerBtn.classList.add('hum-active')
      mobileMenu.classList.add('mm-active')
    } else {
      hamburgerBtn.classList.remove('hum-active')
      mobileMenu.classList.remove('mm-active')
    }
  })

  menuLinks && menuLinks.forEach((menuLink) => {
    menuLink.addEventListener('click', () => {
      dropdownMenus.forEach((dropdownMenu) => {
        if (dropdownMenu.classList.contains('nav-show') && dropdownMenu !== menuLink.nextElementSibling) {
          dropdownMenu.classList.remove('nav-show');
        }
      });
      const dropdownMenu = menuLink.nextElementSibling;
      dropdownMenu.classList.toggle('nav-show');
    });
  });

  /* ========================== 
   Swiper Slider JS
   ==========================*/

  var heroTwoSlider = new Swiper('.hero-slider-two', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 1000,
    effect: 'fade',
    autoplay: {
      delay: 6000,
    },
    fadeEffect: {
      crossFade: true
    },
    navigation: {
      nextEl: '.hero-next',
      prevEl: '.hero-prev'
    }
  });

  var testimonialTwo = new Swiper('.testimonial-slider-two', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    speed: 500,
    pagination: {
      el: '.testi-two-pagi',
    },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      992: {
        slidesPerView: 2
      },
      1200: {
        slidesPerView: 3
      }
    }
  });

  var productDetailsSlider = new Swiper('.product_details__slider', {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: true,
    speed: 500,
    navigation: {
      nextEl: '.pd-next',
      prevEl: '.pd-prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    }
  });

  var packageTwoSlider = new Swiper('.package-two-slider', {
    slidesPerView: 1.2,
    spaceBetween: 30,
    loop: true,
    speed: 500,
    pagination: {
      el: '.pack-two-pagi',
    },
    breakpoints: {
      320: {
        slidesPerView: 1.2
      },
      567: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    }
  });

  var packageTwoSlider = new Swiper('.package-three-slider', {
    slidesPerView: 1.2,
    spaceBetween: 30,
    loop: false,
    navigation: {
      nextEl: '.pack-next',
      prevEl: '.pack-prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 1.2
      },
      567: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
    }
  });

  var brandSlider = new Swiper('.partner-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    slidesPerView: 'auto',
    speed: 7000,
    grabCursor: true,
    mousewheelControl: true,
    keyboardControl: true,
    autoplay: {
      delay: 1,
      disableOnInteraction: false
    },
    breakpoints: {
      320: {
        slidesPerView: 2
      },
      480: {
        slidesPerView: 3
      },
      768: {
        slidesPerView: 4
      },
      1200: {
        slidesPerView: 6
      },
      2000: {
        slidesPerView: 8
      }
    }
  });

  var instaFeed = new Swiper('.insta-feed-slider', {
    slidesPerView: 2,
    spaceBetween: 30,
    loop: false,
    breakpoints: {
      320: {
        slidesPerView: 2
      },
      480: {
        slidesPerView: 3
      },
      768: {
        slidesPerView: 4
      },
      1200: {
        slidesPerView: 5
      }
    }
  });

  var destinationSliderOne = new Swiper('.destination-slider-one', {
    slidesPerView: 1.3,
    spaceBetween: 30,
    loop: false,
    breakpoints: {
      320: {
        slidesPerView: 1.3
      },
      480: {
        slidesPerView: 1.8
      },
      768: {
        slidesPerView: 2.2
      },
    }
  });

  var testimonialOne = new Swiper('.testimonial-slider-one', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    navigation: {
      nextEl: '.testi-next',
      prevEl: '.testi-prev'
    }
  });

  var testimonialOne = new Swiper('.testimonial-slider-three', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    navigation: {
      nextEl: '.testi-next',
      prevEl: '.testi-prev'
    }
  });

  var blogListSlider = new Swiper('.blog_list__slider', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    navigation: {
      nextEl: '.blog-next',
      prevEl: '.blog-prev'
    }
  });


  /* ========================== 
     Scroll On Top JS
     ==========================*/
  document.getElementById('scrollTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  })

  /* ========================== 
   Leaflet Map JS
   ==========================*/

  const mapElement = document.getElementById('map');

  if (mapElement) {
    var map = L.map(mapElement).setView([51.505, -0.09], 15);
    var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'png'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
  }


  /*js for profile dropdown*/

  const body = document.querySelector('body');
  const dropdownBtn = document.querySelectorAll('.common_dropdown__btn')
  dropdownBtn && dropdownBtn.forEach((item) => {
    item.addEventListener('click', () => {
      item.nextElementSibling.classList.toggle('common_dropdown__active')
    })

    body.addEventListener('click', function (event) {
      if (!item.nextElementSibling.contains(event.target) && !item.contains(event.target)) {
        item.nextElementSibling.classList.remove('common_dropdown__active')
      }
    });
  })


  $(function () {
    $("#slider-range").slider({
      range: true,
      min: 200,
      max: 6000,
      step: 100,
      values: [1000, 5000],
      slide: function (event, ui) {
        $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
      }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
      " - $" + $("#slider-range").slider("values", 1));
  });


  /*Person Booking Calculator*/
  function countChange() {
    const targets = document.querySelectorAll('.js-form-counters')
    if (!targets) return
    targets?.forEach(item => {
      const counters = item.querySelectorAll('.js-counter')

      counters.forEach(el => {
        const count = el.querySelector('.js-count')
        const buttonDown = el.querySelector('.js-down')
        const buttonUp = el.querySelector('.js-up')

        buttonDown.addEventListener('click', () => {
          if (count.innerHTML != 0) {
            count.innerHTML = parseInt(count.innerHTML) - 1

            if (el.getAttribute('data-value-change')) {
              item.querySelector(el.getAttribute('data-value-change')).innerHTML = parseInt(count.innerHTML)
            }
          }
        })

        buttonUp.addEventListener('click', () => {
          count.innerHTML = parseInt(count.innerHTML) + 1

          if (el.getAttribute('data-value-change')) {
            item.querySelector(el.getAttribute('data-value-change')).innerHTML = parseInt(count.innerHTML)
          }
        })
      });
    })
  }
  countChange()


  /*multi-step forms*/
  var currentTab = 0;
  showTab(currentTab);
  function showTab(n) {
    var tabs = document.getElementsByClassName("tab");
    if(tabs[n] == null) {
      return; 
    }
    tabs[n].style.display = "block";
    if (n == 0) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline-flex";
    }
    if (n == (tabs.length - 1)) {
      document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
      document.getElementById("nextBtn").innerHTML = "Next Step";
    }
    fixStepIndicator(n);
  }
  function nextPrev(n) {
    var x = document.getElementsByClassName("tab");
    x[currentTab].style.display = "none";
    currentTab = currentTab + n;

    if (currentTab >= x.length) {
      document.getElementById("regForm").submit();
      return false;
    }

    showTab(currentTab);
  }
  function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("step");

    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active-count", "");
    }
    x[n].className += " active-count";
  }
  document.getElementById('prevBtn')?.addEventListener('click', () => {
    nextPrev(-1)
  })
  document.getElementById('nextBtn')?.addEventListener('click', () => {
    nextPrev(1)
  })



}(jQuery));