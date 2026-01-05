$(document).ready(function () {

    // navbar background
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        if (scroll >= 10) {
            $(".navbar").addClass("bg-light");
            $(".navbar").removeClass("bg-dark");
        } else {
            $(".navbar").addClass("bg-dark");
            $(".navbar").removeClass("bg-light");
        }
    });

    $(window).resize(function () {
        updateImages();
    });

    updateImages();

    function updateImages() {
        if ($(window).width() < 768) {
            // $('.online-cardbg').parallax({ imageSrc: 'images/4-mobile.png' });
            // $('.pdf-bg').parallax({ imageSrc: 'images/3-mobile.png' });
        }
        else {
            $('.online-cardbg').parallax({ imageSrc: 'images/mobile-left.jpg' });
            $('.pdf-bg').parallax({ imageSrc: 'images/3_new.png' });
        }

        // $('.pricing-bg').parallax({ imageSrc: 'images/price-bg-big.jpg' });

    }


    $(".pricing-btn").click(function () {
        $('#price').find('option:selected').removeAttr("selected");

        var value = $(this).attr('id');
        console.log('value: ', value);
        $("#contact_form #price option[value=" + value + "]").attr('selected', 'selected');

        openModal();
    });

    $('.open-contact-modal').click(function(){
        openModal();
    });

    function openModal() {
        $('.contact-left').css({'opacity': '1', 'z-index': '99999'});
        $('.contact-right').css({'opacity': '1', 'z-index': '99999'});

            // $('.contact-form').show();
            $(".contact-left").animate({
                "left":"0px", 
                // "opacity":"1", 
                // "transform":"translate3d(0px, 0, 0)",
                // "z-index":"99999",
            }, 1500 );

            var lft = "50%";
            if ($(window).width() < 768) {
                var lft = '0%';
            } 

            $(".contact-right").animate({
                // "left":"0px", 
                // "opacity":"1", 
                // "z-index":"99999",
                "left": lft
            }, 1200 );

    }

    $('.go-back').click(function(){
        // $('body').css({'opacity': '0'});
        $(".contact-left").animate({
            "left":"2000px", 
            // "opacity":"0", 
            // "z-index":"0"
        }, 1500 );

        $(".contact-right").animate({
            "left":"3000px", 
            // "opacity":"0", 
            // "z-index":"0",
        }, 1200 );
        setTimeout(() => {
            
            $('.contact-left').css({'opacity': '0', 'z-index': '0'});
            $('.contact-right').css({'opacity': '0', 'z-index': '0'});
        }, 900);
    });


    // testimonials cariusel
    $('.owl-carousel').owlCarousel({
        loop: true,
        responsiveClass: true,
        autoHeight: true,
        autoplayTimeout: 7000,
        smartSpeed: 800,
        autoplay: false,
        dots: false,
        navs: false,
        // margin: 10,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 1,
            },
            1000: {
                items: 3,
            }
        }
    });

    // animations
    new WOW().init();

    


    // send mail
    $('#contact_form').submit(function (e) {
        e.preventDefault();
        get_data();
    });

    $('#submit').click(function () {
        get_data();
    });

    function get_data() {
        $('.error-message').hide();
        $('.server-message').hide();
        $('.success-message').hide();
        $('.spinner-border').show();
        $('#submit').prop("disabled", true);

        $.ajax({
            url: "save_data.php",
            type: "post",
            data: $("#contact_form").serialize(),
            cache: false,
            success: function (response) {
                console.log('response: ', response);
                if (response == 'data-empty') {
                    $('.error-message').show();
                    $('.spinner-border').hide();
                    $('#submit').prop("disabled", false);
                }
                else if (response == 'Message-sent') {
                    $('.success-message').show();
                    $('.spinner-border').hide();
                    $('#submit').prop("disabled", false);
                    setTimeout(() => {
                        $('.success-message').hide();
                        $('#contactmodal').modal('toggle');
                        $('#contact_form input[type="text"]').val('');
                        $('#contact_form textarea').val('');
                    }, 2500);
                }
                else if (response == 'Message-not-sent') {
                    $('.server-message').show();
                    $('.spinner-border').hide();
                    $('#submit').prop("disabled", false);
                }
                else {
                    $('.server-message').show();
                    $('.spinner-border').hide();
                    $('#submit').prop("disabled", false);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                // console.log(textStatus, errorThrown);
                $('.server-message').show();
                $('.spinner-border').hide();
                $('#submit').prop("disabled", false);

            }
        }); // ajax call end

    }


    // $('a[href*=#]').click(function (event) {
    //     $('html, body').animate({
    //         scrollTop: $($.attr(this, 'href')).offset().top
    //     }, 500);
    //     event.preventDefault();
    // });


});
