/*
   Template Name: BitVaults | Bitcoin and CryptoCurrency HTML Template
   Author: ThemeFunction
   Author URI: https://themeforest.net/user/themefunction
   Description: BitVaults | Bitcoin and CryptoCurrency HTML Template
   Version: 1.0

   1. Menu Toggle
   2. Main Slider
   3. Currency Slider
   4. Testimonial Slider
   5. Partner Slider
   6. Top News Slider
   7. Converter
   8. Video Popup
   9. Counter Up
   10. Map
   11. Back To Top
   12. Site Search
   13. Contact Form
   14. Owl Sync Slider
   15. Input Increase
   16. Product Slider
   17. Accordion
   18. Gallery
   19. Countdown
   20. Particles
   21. Chart
   22. Progress Bar
   23. Fixed Header

*/


jQuery(function ($) {
   "use strict";

   $(window).on('load', function () {
      menuFixed();
   });

   $(document).ready(function () {

      /* ---------------------------------------------
                     Menu Toggle 
      ------------------------------------------------ */

      if ($(window).width() < 991) {
         $(".navbar-nav li a").on("click", function () {
            $(this).parent("li").find(".dropdown-menu").slideToggle();
            $(this).find("i").toggleClass("fa-angle-up fa-angle-down");
         });
      }


      /* ---------------------------------------------
                     Main Slider 
      ------------------------------------------------ */

      if ($('.slide-carousel').length > 0) {
         $('.slide-carousel').owlCarousel({
            items: 1,
            loop: true,
            smartSpeed: 900,
            nav: true,
            navText:['<i class="icon icon-left-arrow2"></i>','<i class="icon icon-right-arrow2"></i>'],
            dots: true,
         });
      }


      /* ---------------------------------------------
                     Currency Slider 
      ------------------------------------------------ */

      if ($('.currency-carousel').length > 0) {
         $('.currency-carousel').owlCarousel({
            items: 10,
            loop: true,
            autoplay: true,
            autoplayTimeout: 1000,
            smartSpeed: 900,
            nav: false,
            navText:['<i class="icon icon-arrow-left"></i>','<i class="icon icon-arrow-right"></i>'],
            dots: false,
            responsiveClass: true,
            autoplayHoverPause: true,
            responsive: {
               0: {
                  items: 3,
                  dots: false,
                  nav: false,
               },
               600: {
                  items: 6,
                  dots: false,
                  nav: false,
               },
               1000: {
                  items: 10,
                  dots: false,
                  nav: false,
               }
            }
         });
      }


      /* ---------------------------------------------
                     Testimonial Slider 
      ------------------------------------------------ */

      if ($('.testimonial-slide').length > 0) {
         $('.testimonial-slide').owlCarousel({
            items: 1,
            margin: 20,
            loop: true,
            autoplay: false,
            autoplayTimeout: 1000,
            smartSpeed: 900,
            nav: true,
            navText: ['<i class="icon icon-left-arrow2"></i>','<i class="icon icon-right-arrow2"></i>']
         });
      }


      /* ---------------------------------------------
                     Partner Slider 
      ------------------------------------------------ */

      if ($('.partner-slide').length > 0) {
         $('.partner-slide').owlCarousel({
            items: 5,
            loop: true,
            autoplay: false,
            autoplayTimeout: 1000,
            smartSpeed: 900,
            nav: false,
            responsiveClass: true,
            responsive: {
               0: {
                  items: 1,
                  dots: false
               },
               600: {
                  items: 2,
                  dots: false,
               },
               1000: {
                  dots: false,
               }
            }
         });
      }


      /* ---------------------------------------------
                     Top News Slider 
      ------------------------------------------------ */

      if ($('.top-news-slide').length > 0) {
         $('.top-news-slide').owlCarousel({
            items: 1,
            loop: true,
            autoplay: false,
            autoplayTimeout: 1000,
            smartSpeed: 900,
            nav: true,
            dots: false,
            navText: ['<i class="fa fa-caret-left"></i>','<i class="fa fa-caret-right"></i>']
         });
      }

      /* ---------------------------------------------
                     Converter 
      ------------------------------------------------ */

      $(document).on('click', '.btn-select', function (e) {
         e.preventDefault();
         var ul = $(this).find("ul");
         if ($(this).hasClass("active")) {
            if (ul.find("li").is(e.target)) {
               var target = $(e.target);
               target.addClass("selected").siblings().removeClass("selected");
               var value = target.html();
               $(this).find(".btn-select-value").html(value);
            }
            ul.hide();
            $(this).removeClass("active");
         }
         else {
            $('.btn-select').not(this).each(function () {
               $(this).removeClass("active").find("ul").hide();
            });
            ul.slideDown(300);
            $(this).addClass("active");
         }
      });

      $(document).on('click', function (e) {
         var target = $(e.target).closest(".btn-select-value, .btn-select-arrow");
         if (!target.length) {
            $(".btn-select").removeClass("active").find("ul").hide();
         }
      });
            
      var $btc = $('#btc');
      var $pesos = $('#pesos');
      var $dolar = $('#dolar');

      $.get('https://api.coindesk.com/v1/bpi/currentprice/COP.json', function( data ) {

         var BTC_COP = JSON.parse(data).bpi.COP.rate_float;
         var BTC_USD = JSON.parse(data).bpi.USD.rate_float;

         $btc.removeAttr('disabled');
         $pesos.removeAttr('disabled');
         $dolar.removeAttr('disabled');

         $btc.keyup(function(e) {

            $btc.val(clearText($btc.val()))
            var money = changeBtc($btc.val());
            $dolar.val(money.usdC);
            $pesos.val(money.copC);
         });
         $pesos.keyup(function(e) {

            $pesos.val(clearText($pesos.val()))
            var money = changeMoney({ type: 'COP', v: clearText($pesos.val())});
            $dolar.val(money.usdC);
            $btc.val(money.btcC);
         });

         $dolar.keyup(function(e) {
            $dolar.val(clearText($dolar.val()))
            var money = changeMoney({ type: 'USD', v: clearText($dolar.val())});
            $pesos.val(money.copC)
            $btc.val(money.btcC);
         });
         
         function changeBtc(amount) {
            return {
            copC:  amount * BTC_COP,
            usdC: amount * BTC_USD
            };
         }

         function changeMoney(money) {
            var coins = {
            'COP' : BTC_COP,
            'USD': BTC_USD,
            }

            let btcC = (money.v/coins[money.type]).toFixed(8);

            return {
            btcC: btcC,
            copC : btcC * BTC_COP,
            usdC : btcC * BTC_USD
            };
         }
         
      });

      function clearText(str) {
         return str.replace(/[^0-9+\.]/g, '');
      } 

      /* ---------------------------------------------
                     Video Popup 
      ------------------------------------------------ */

      if($('.video-play-btn').length > 0){
         $('.video-play-btn').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
   
            fixedContentPos: false
         });
      }

      /* ---------------------------------------------
                     Counter Up 
      ------------------------------------------------ */

      $(".counterUp").counterUp({
         delay: 10,
         time: 1000,
      });

      
      /* ---------------------------------------------
                     Map 
      ------------------------------------------------ */

   if ($('#map').length > 0) {

      var contactmap = {
         lat: -37.816218,
         lng: 144.964068
      };

      $('#map')
         .gmap3({
            zoom: 12,
            center: contactmap,
            scrollwheel: false,
            mapTypeId: "shadeOfGrey",
            mapTypeControlOptions: {
               mapTypeIds: [google.maps.MapTypeId.ROADMAP, "shadeOfGrey"]
            }
         })

         .styledmaptype(
            "shadeOfGrey", [

               {
                  "featureType": "administrative",
                  "elementType": "geometry.stroke",
                  "stylers": [{
                     "color": "#fefefe"
                  }, {
                     "lightness": 17
                  }, {
                     "weight": 1.2
                  }]
               },
               {
                  "featureType": "administrative",
                  "elementType": "geometry.fill",
                  "stylers": [{
                     "color": "#fefefe"
                  }, {
                     "lightness": 20
                  }]
               },
               {
                  "featureType": "transit",
                  "elementType": "geometry",
                  "stylers": [{
                     "color": "#f2f2f2"
                  }, {
                     "lightness": 19
                  }]
               },
               {
                  "featureType": "all",
                  "elementType": "labels.icon",
                  "stylers": [{
                     "visibility": "off"
                  }]
               },
               {
                  "featureType": "all",
                  "elementType": "labels.text.fill",
                  "stylers": [{
                     "saturation": 36
                  }, {
                     "color": "#333333"
                  }, {
                     "lightness": 40
                  }]
               },
               {
                  "featureType": "all",
                  "elementType": "labels.text.stroke",
                  "stylers": [{
                     "visibility": "on"
                  }, {
                     "color": "#ffffff"
                  }, {
                     "lightness": 16
                  }]
               },
               {
                  "featureType": "poi",
                  "elementType": "geometry",
                  "stylers": [{
                     "color": "#f5f5f5"
                  }, {
                     "lightness": 21
                  }]
               },
               {
                  "featureType": "road.local",
                  "elementType": "geometry",
                  "stylers": [{
                     "color": "#ffffff"
                  }, {
                     "lightness": 16
                  }]
               },
               {
                  "featureType": "road.arterial",
                  "elementType": "geometry",
                  "stylers": [{
                     "color": "#ffffff"
                  }, {
                     "lightness": 18
                  }]
               },
               {
                  "featureType": "road.highway",
                  "elementType": "geometry.stroke",
                  "stylers": [{
                     "color": "#ffffff"
                  }, {
                     "lightness": 29
                  }, {
                     "weight": 0.2
                  }]
               },
               {
                  "featureType": "road.highway",
                  "elementType": "geometry.fill",
                  "stylers": [{
                     "color": "#ffffff"
                  }, {
                     "lightness": 17
                  }]
               },
               {
                  "featureType": "landscape",
                  "elementType": "geometry",
                  "stylers": [{
                     "color": "#f5f5f5"
                  }, {
                     "lightness": 20
                  }]
               },
               {
                  "featureType": "water",
                  "elementType": "geometry",
                  "stylers": [{
                     "color": "#e9e9e9"
                  }, {
                     "lightness": 17
                  }]
               }
            ], {
               name: "HQ"
            }
         )

         .marker({
            position: contactmap,
            icon: 'images/map-icon.png'
         })

         .infowindow({
            position: contactmap,
            content: "16122 Collins Street West. Victoria"
         })

         .then(function (infowindow) {
            var map = this.get(0);
            var marker = this.get(1);
            marker.addListener('click', function () {
               infowindow.open(map, marker);
            });
         });
   }

   /* ---------------------------------------------
                  Back to top 
   ------------------------------------------------ */

   $(window).scroll(function () {
      if ($(this).scrollTop() > 50) {
             $('#back-to-top').fadeIn();
      } else {
             $('#back-to-top').fadeOut();
            }
      });

      // scroll body to 0px on click
      $('#back-to-top').on('click', function () {
            $('#back-to-top').tooltip('hide');
            $('body,html').animate({
                  scrollTop: 0
            }, 800);
            return false;
      });

      $('#back-to-top').tooltip('hide');

   });

   /* ---------------------------------------------
                  Site Search 
   ------------------------------------------------ */

   $('.nav-search').on('click', function(){
      $('.search-overlay').addClass('show');
   });
   $('.search-overlay .close-btn').on('click', function(){
      $('.search-overlay').removeClass('show');
   });

   /* ---------------------------------------------
                  Contact Form 
   ------------------------------------------------ */

   $('#contact-form').submit(function () {

      var $form = $(this),
         $error = $form.find('.error-container'),
         action = $form.attr('action');

      $error.slideUp(750, function () {
         $error.hide();

         var $name = $form.find('.form-name'),
            $phone = $form.find('.form-phone'),
            $email = $form.find('.form-email'),
            $url = $form.find('.form-website'),
            $message = $form.find('.form-message');

         $.post(action, {
               name: $name.val(),
               phone: $phone.val(),
               email: $email.val(),
               url: $url.val(),
               message: $message.val()
            },
            function (data) {
               $error.html(data);
               $error.slideDown('slow');

               if (data.match('success') != null) {
                  $name.val('');
                  $phone.val('');
                  $email.val('');
                  $url.val('');
                  $message.val('');
               }
            }
         );

      });

      return false;

   });

   /* ---------------------------------------------
                  Owl Sync Slider 
   ------------------------------------------------ */

   if ( ( $( '#sync1' ).length > 0 ) && ( $( '#sync2' ).length > 0 ) ) {
            var sync1 = $( "#sync1" ),
            sync2 = $( "#sync2" ),
            slidesPerPage = 4,
            syncedSecondary = true;
            sync1.owlCarousel( {
            items: 1,
               smartSpeed: 1000,
               autoplay: false,
               dots: false,
               loop: true,
               responsiveRefreshRate: 200,
               nav: false,
               navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            } ).on( 'changed.owl.carousel', syncPosition );
            sync2
            .on( 'initialized.owl.carousel', function( ) {
            sync2.find( ".owl-item" ).eq( 0 ).addClass( "current" );
            } )
            .owlCarousel( {
            items: slidesPerPage,
               dots: false,
               nav: false,
               margin: 20,
               smartSpeed: 1000,
               slideBy: slidesPerPage,
               //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
               responsiveRefreshRate: 100
            } ).on( 'changed.owl.carousel', syncPosition2 );
            function syncPosition( el ) {
            //if you set loop to false, you have to restore this next line
            //var current = el.item.index;

            //if you disable loop you have to comment this block
            var count = el.item.count - 1;
               var current = Math.round( el.item.index - ( el.item.count / 2 ) - .5 );
               if ( current < 0 ) {
            current = count;
            }
            if ( current > count )  {
            current = 0;
            }

            //end block

            sync2
               .find( ".owl-item" )
               .removeClass( "current" )
               .eq( current )
               .addClass( "current" );
               var onscreen = sync2.find( '.owl-item.active' ).length - 1;
               var start = sync2.find( '.owl-item.active' ).first( ).index( );
               var end = sync2.find( '.owl-item.active' ).last( ).index( );
               if ( current > end ) {
                  sync2.data( 'owl.carousel' ).to( current, 100, true );
               }
               if ( current < start ) {
                  sync2.data( 'owl.carousel' ).to( current - onscreen, 100, true );
               }
            }

            function syncPosition2( el ) {
            if ( syncedSecondary ) {
            var number = el.item.index;
               sync1.data( 'owl.carousel' ).to( number, 100, true );
            }
            }

            sync2.on( "click", ".owl-item", function( e ) {
            e.preventDefault( );
               var number = $( this ).index( );
               sync1.data( 'owl.carousel' ).to( number, 300, true );
            } );
   }

      /* ---------------------------------------------
                     Input Increase 
      ------------------------------------------------ */

      var thiss = $( '.product-input-number' );
			thiss.append( '<span class="product-add"><i class="fa fa-plus"></i></span>' );
			thiss.append( '<span class="product-sub"><i class="fa fa-minus"></i></span>' );
			$( '.product-input-number' ).each( function( ) {

		var spinner = $( this ),
			input = spinner.find( 'input[type="number"]' ),
			add = spinner.find( '.product-add' ),
			sub = spinner.find( '.product-sub' );
			input.parent( ).on( 'click', '.product-sub', function( event ) {
		event.preventDefault( );
			/* Act on the event */
			if ( input.val( ) > parseInt( input.attr( 'min' ) ) )
			input.val( function( i, oldval ) { return --oldval; } );
		} );
			input.parent( ).on( 'click', '.product-add', function ( ) {
		event.preventDefault( );
			if ( input.val( ) < parseInt( input.attr( 'max' ) ) )
			input.val( function( i, oldval ) { return ++oldval; } );
		} );
         } );
         
      /* ---------------------------------------------
            Product Slider 
      ------------------------------------------------ */

      if($('.product-slider').length > 0){
         $('.product-slider').owlCarousel({
            items: 3,
            loop: true,
            margin: 20,
            nav: true,
            dots: false,
            smartSpeed: 800,
            navText: ['<i class="icon icon-arrow-left"></i>','<i class="icon icon-arrow-right"></i>'],
            responsive: {
               0: {
                  items: 1,
                  nav: false,
                  dots: false,
               },
               600: {
                  items: 1,
                  nav: false,
                  dots: false,
               },
               1000: {
                  items: 3,
               },
            }
         });
      }

      /* ---------------------------------------------
                     Faq Accordion 
      ------------------------------------------------ */

      $('.collapse').on('shown.bs.collapse', function () {
         $(this).parent().addClass('active');
      });
 
      $('.collapse').on('hidden.bs.collapse', function () {
         $(this).parent().removeClass('active');
      });

      /* ---------------------------------------------
                     Countdown 
      ------------------------------------------------ */

      if($('#countdown-clock').length > 0){
         $('#countdown-clock').countdown('2020/10/10', function(event) {
            var $this = $(this).html(event.strftime(''
               + '<div class="counter-time"><span class="day">%D</span>Days</div>'
               + '<div class="counter-time"><span class="hour">%H</span>Hour</div>'
               + '<div class="counter-time"><span class="minute">%M</span>Min</div>'
               + '<div class="counter-time"><span class="sec">%S</span>Sec</div>'
            ));
            });
      }

      
      /* ---------------------------------------------
                     Particle 
      ------------------------------------------------ */
      
         if($('#particles-js').length > 0){
            particlesJS("particles-js", {
               "particles": {
               "number": {
                  "value": 90,
                  "density": {
                     "enable": true,
                     "value_area": 800
                  }
               },
               "color": {
                  "value": "#ffffff"
               },
               "shape": {
                  "type": "circle",
                  "stroke": {
                     "width": 0,
                     "color": "#000000"
                  },
                  "polygon": {
                     "nb_sides": 5
                  },
                  "image": {
                     "src": "img/github.svg",
                     "width": 100,
                     "height": 100
                  }
               },
               "opacity": {
                  "value": 0.3,
                  "random": false,
                  "anim": {
                     "enable": false,
                     "speed": 1,
                     "opacity_min": 0.1,
                     "sync": false
                  }
               },
               "size": {
                  "value": 4,
                  "random": true,
                  "anim": {
                     "enable": false,
                     "speed": 60,
                     "size_min": 0.1,
                     "sync": false
                  }
               },
               "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#ffffff",
                  "opacity": 0.3,
                  "width": 1
               },
               "move": {
                  "enable": true,
                  "speed": 7,
                  "direction": "none",
                  "random": false,
                  "straight": false,
                  "out_mode": "out",
                  "bounce": false,
                  "attract": {
                     "enable": false,
                     "rotateX": 600,
                     "rotateY": 1200
                  }
               }
               },
               "interactivity": {
               "detect_on": "canvas",
               "events": {
                  "onhover": {
                     "enable": true,
                     "mode": "grab"
                  },
                  "onclick": {
                     "enable": true,
                     "mode": "push"
                  },
                  "resize": true
               },
               "modes": {
                  "grab": {
                     "distance": 140,
                     "line_linked": {
                     "opacity": 1
                     }
                  },
                  "bubble": {
                     "distance": 400,
                     "size": 30,
                     "duration": 2,
                     "opacity": 8,
                     "speed": 3
                  },
                  "repulse": {
                     "distance": 200,
                     "duration": 0.4
                  },
                  "push": {
                     "particles_nb": 4
                  },
                  "remove": {
                     "particles_nb": 2
                  }
               }
               },
               "retina_detect": true
            });
         }

      /* ---------------------------------------------
                           Chart 
      ------------------------------------------------ */

         if($('#myChart').length > 0){
            var ctx = document.getElementById("myChart").getContext('2d');
            var myChart = new Chart(ctx, {
               type: 'doughnut',
               data: {
                  labels: ["Members", "Buyers", "Marketers", "Free"],
                  datasets: [{
                        data: [70,10,8,10],
                        backgroundColor: [
                           '#ff783c',
                           '#ff5c9c',
                           '#ffdc56',
                           '#22b4f4'
                        ],
                        borderColor: [
                           '#ff783c',
                           '#ff5c9c',
                           '#ffdc56',
                           '#22b4f4'
                        ],
                        borderWidth: 1
                  }]
               },
               options: {
                  legend: {
                     display: false,
                 }
               }
            });
         }

         /* Chart 2 */

         if($('#myChartTwo').length > 0){
            var ctxTwo = document.getElementById("myChartTwo").getContext('2d');
            var myChartTwo = new Chart(ctxTwo, {
               type: 'doughnut',
               data: {
                  labels: ["Buyers", "Members", "Marketers", "Free"],
                  datasets: [{
                        data: [70,10,8,10],
                        backgroundColor: [
                           '#ff5c9c',
                           '#ffdc56',
                           '#ff783c',
                           '#22b4f4'
                        ],
                        borderColor: [
                           '#ff5c9c',
                           '#ffdc56',
                           '#ff783c',
                           '#22b4f4'
                        ],
                        borderWidth: 1
                  }]
               },
               options: {
                  legend: {
                     display: false,
                 }
               }
            });
         }

      /* ---------------------------------------------
                        Progress Bar 
      ------------------------------------------------ */

      if($('.progress .progress-bar').length > 0){
         $('.progress .progress-bar').css("width",function() {
               return $(this).attr("aria-valuenow") + "%";
            }
         );
      }

      /* ---------------------------------------------
                        Fixed Header 
      ------------------------------------------------ */

      function menuFixed() {
         var wWidth = $(window).width();
         if (wWidth > 974) {
            if ($('.site-top').length) {
               var sticky = $('.site-top'),
                  scroll = $(window).scrollTop();
   
               if (scroll >= 800) sticky.addClass('menu-fixed');
               else sticky.removeClass('menu-fixed');
   
            };
         }
      }
      $(document).on('scroll', function () {
         menuFixed();
      });

      /* ---------------------------------------------
                     Click To Scroll 
      ------------------------------------------------ */

      if($('.site-navigation .nav-item .nav-link').length > 0){
         $('.site-navigation .nav-item .nav-link').on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({
               scrollTop: $($(this).attr('href')).offset().top - 45
            }, 1000, 'linear');
         });
      }

});