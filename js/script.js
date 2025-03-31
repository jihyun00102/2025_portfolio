$(function(){
    Splitting();
    AOS.init();

    $("header .mobile_btn").on("click",function () {
       $("header").toggleClass("mobile");
    });

    // scroll
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 800);
    });
    
    gsap.ticker.lagSmoothing(0);

    gsap.registerPlugin(ScrollTrigger);

    // preview
    gsap.to('.preview',{opacity:0, "z-index":0, delay: 2.5,ease: Power4.easeIn});
    gsap.to('.preview',{height:0, delay: 3,ease: Power4.easeIn});
    
    // intro
    gsap.timeline({
        onComplete:function(){
          visualTextAni.play();
        }
    });

    gsap.set('.main_text .headline span',{yPercent:100})
    const visualTextAni = gsap.to('.main_text .headline span',{
      paused:true,
      yPercent:0,
      ease: Power4.easeInOut,
      delay: 2.35,
      duration: 0.8
    });

    // about
    function isMobile() {
        return $(window).width() <= 600;
    }

    let about_scroll = isMobile() ? 90 : 130;
    let scrollTriggerInstance;

    function initScrollTrigger() {
        if (scrollTriggerInstance) {
            scrollTriggerInstance.kill();
        }

        scrollTriggerInstance = gsap.timeline({
            scrollTrigger: {
                trigger: '.intro',
                start: '50% top',
                end: '110% top',
                scrub: 1
            }
        })
        .fromTo(".about", {            
            "--about-left": `0%`,
            "--about-right": `0%`},
            {
            "--about-left": `-${about_scroll}%`,
            "--about-right": `-${about_scroll}%`,
            duration: 1,
            ease: "power1.out"
        });
    }
    initScrollTrigger();

    $(window).on('resize', function() {
        about_scroll = isMobile() ? 90 : 130;
        initScrollTrigger();
    });

    // work
    gsap.utils.toArray(".col_item").forEach(item => {
        const Motion = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                end: "top top",
                scrub: 0.3
            }
        });
        
        Motion.set(item, {
            opacity: 0,
            transform:"translateY(20%)"
        })
        .to(item, {
            opacity: 1,
            transform:"translateY(0%)"
        });
    });


    // cursor
    gsap.set(".cursor", {xPercent: -50, yPercent: -50});

    let xTo = gsap.quickTo(".cursor", "x", {duration: 0.6, ease: "power3"}),
        yTo = gsap.quickTo(".cursor", "y", {duration: 0.6, ease: "power3"});

    let currentHover = null;
    let cursor_img = $(".cursor_img");

    $(window).on("mousemove", function(e) {
        xTo(e.clientX);
        yTo(e.clientY);

        cursor_img.css({
            top: e.clientY + 'px',
            left: (e.clientX + 50) + 'px'
        });

        // header hover
        $("header .gnb li").each(function() {
            const rect = this.getBoundingClientRect();
            const isHover = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            
            if (isHover) {
                if (currentHover !== this) {
                    currentHover = this;
                    gsap.to(".cursor", {scale: 1.8, duration: 0.3, ease: "power2.out"});
                }
            } else {
                if (currentHover === this) {
                    currentHover = null;
                    gsap.to(".cursor", {scale: 1, duration: 0.3});
                }
            }
        });
    });
    

    $(".extra_list li").each(function() {
        $(this).hover(function() {
            gsap.to(".cursor", {scale: 0.5, duration: 0.3, ease: "power2.out"});
        },function() {
            gsap.to(".cursor", {scale: 1, duration: 0.3, ease: "power2.out"});
        });
    });

    // click event prevent
    function scrollToTarget(target, duration, callback) {
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, duration, callback);
    }
    
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        var target = this.hash;
    
        if ($(this).closest('header .fixer').length) {
            scrollToTarget(target, 500, function() {
                $("header").removeClass("mobile");
            });
        } else {
            scrollToTarget(target, 600);
        }
    });
});