/*******************************************************
**  
**  Presets for section transitions
**
*******************************************************/

var init;

function validateDuration (t) {

    // first transition is instant
    if (!init) {
        init = true;
        t = 0;
    }

    return (t > 0) ? t : 0;
}

var SectionTransitions = {


    None: function (next, prev, callback, duration) {
        callback();
    },

    CrossFade: function (next, prev, callback, duration) {

        var duration = validateDuration(duration);

        TweenMax.fromTo(next.parentEl, duration, {x:0, alpha:0}, {x:0, alpha:1, ease:Power2.inOut, onComplete:callback});

        // first transition will not have a previous section
        if (prev) {
            TweenMax.fromTo(prev.parentEl, duration, {x:0, alpha:1}, {x:0, alpha:0, ease:Power2.inOut});
        }
    },

    SlideLeftToRight: function (next, prev, callback, duration) {

        var duration = validateDuration(duration);
        var w = window.innerWidth;

        TweenMax.fromTo(next.parentEl, duration, {x:w}, {x:0, ease:Power4.in, onComplete:callback});

        // first transition will not have a previous section
        if (prev) {
            TweenMax.fromTo(prev.parentEl, duration, {x:0}, {x:-w, ease:Power4.in});
        }
    },

    CoverLeftToRight: function (next, prev, callback, duration) {

        var duration = validateDuration(duration);
        var w = window.innerWidth;

        TweenMax.fromTo(next.parentEl, duration, {zIndex:0, x:-w}, {x:0, ease:Power4.in, onComplete:callback});

        // first transition will not have a previous section
        if (prev) {
            TweenMax.fromTo(prev.parentEl, duration, {zIndex:-1}, {ease:Power4.in, onComplete:function(){
                TweenMax.set(prev.parentEl, {zIndex:0});
            }});
        }
    },

}

export default SectionTransitions;