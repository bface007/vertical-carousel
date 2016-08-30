/**
 * Created by bface007 on 08/04/2016.
 */
(function ($) {
    'use strict';

    var $mainCarousel = $('#main-carousel'),
        $startUpCarousel = $('#startup-carousel'),
        $verticalCarousel = $('#vertical-carousel'),
        $carouselParent = $verticalCarousel.parent(),
        $actionUp = $carouselParent.find('.action.top'),
        $actionDown = $carouselParent.find('.action.bottom'),
        $scrollTop = $('#scroll-to-top'),
        offset = 200,
        cache = 0,
        topItem = 0;

    if($mainCarousel.length) {
        $mainCarousel.owlCarousel({
            slideSpeed : 300,
            paginationSpeed : 400,
            singleItem:true,
            transitionStyle : "fadeUp",
            afterAction : syncPosition
        });
        $('#main-carousel-actions').find('.action').click(function () {
            var $this = $(this);
            if($this.hasClass('action-left'))
                $mainCarousel.trigger('owl.prev');
            else if($this.hasClass('action-right'))
                $mainCarousel.trigger('owl.next');
        });
    }
    
    if($verticalCarousel.length) {

        $verticalCarousel.empty();

        $verticalCarousel.on("click", "li > div", function (e) {
            e.preventDefault();
            var number = $(this).data('vcarousel');
            $mainCarousel.trigger("owl.goTo", number);
        });

        var allItems = $mainCarousel.find('.item');

        if( allItems.length > 0 ) {
            allItems.each(function (index) {
                var $li = createElement('li'),
                    $div = createElement('div');

                $li.append($div);
                $div.data('vcarousel', index);
                $div.html(clean($(this).children('.caption').clone()));

                $div.css('height', (400 / 3)+ 'px');

                $verticalCarousel.append($li);
            });

            var $verticalCarouselChild = $verticalCarousel.children('li');
            $verticalCarouselChild.eq(0).addClass('active');

            var $next = null;

            if(allItems.length > 1)
                $next = $verticalCarousel.children('li').eq(1);

            var offsetTop = $verticalCarousel.offset().top;

            setActive($actionUp, false);
            if(allItems.length <= 3)
                setActive($actionDown, false);

            $actionUp.click(function () {
                if(isInactivated($(this)))
                    return;
                if(hasReachBottom())
                    return;

                console.log('parent top offset: '+ offsetTop);
                console.log($verticalCarousel.outerHeight());
                console.log('child top offset: '+ $next.offset().top);
                translateY(1, 'top');
                topItem--;
                showlog(topItem);

                updateCarouselAction()
            });
            $actionDown.click(function () {
                if(isInactivated($(this)))
                    return;
                if(hasReachTop())
                    return;

                translateY(1, 'bottom');
                topItem++;
                showlog(topItem);
                updateCarouselAction()
            });
        }


    }

    function createElement(el) {
        var _el = document.createElement(el);
        return $(_el);
    }

    function isInactivated(el) {
        return el.hasClass('inactive');
    }

    function setActive(el, choice) {
        if(choice == null || choice == undefined)
            choice = true;

        console.log('setactive ', choice);
        console.log(el);
        if(choice)
            el.removeClass('inactive');
        else
            el.addClass('inactive');

    }

    function clean(el) {
        var text = el.find('h2').text();
        el.find('h2').html(text);
        return el;
    }

    function translateY(increment, position) {
        increment = increment || 1;
        position = position || 'top';

        if(position == 'top') {
            cache = cache + (400 / 3) * increment;
            $verticalCarousel.css('transform', 'translateY('+ cache +'px)');
            console.log(cache);
        }else if(position == 'bottom'){
            cache = cache - (400 / 3) * increment;
            $verticalCarousel.css('transform', 'translateY('+ cache +'px)');
            console.log(cache);
        }

    }
    function showlog(currentItem) {
        console.log("topItem ", currentItem);
    }

    function syncPosition(el) {
        var current = this.currentItem;
        $verticalCarousel
            .find('li')
            .removeClass('active')
            .eq(current)
            .addClass('active');
        console.log(topItem);
        console.log(current)
        center(current, el.find('.item').length)
    }

    function center(current, elemLength) {
        console.log("elemLength ", elemLength);
        current = (current >= elemLength - 3) ? elemLength - 3 : current;
        topItem = current;
        cache = (400 / 3) * current * -1;
        $verticalCarousel.css('transform', 'translateY('+ cache +'px)');
        updateCarouselAction();
    }

    function hasReachTop() {
        console.log('topItem : ', topItem);
        return topItem >= $verticalCarousel.find('li').length - 3;
    }

    function hasReachBottom() {
        console.log('topItem : ', topItem);
        return topItem == 0;
    }

    function updateCarouselAction() {
        if(hasReachBottom()) {
            setActive($actionUp, false);
        }else {
            setActive($actionUp, true)
        }
        if(hasReachTop()) {
            setActive($actionDown, false);
        }else
            setActive($actionDown, true);
    }
})(jQuery);