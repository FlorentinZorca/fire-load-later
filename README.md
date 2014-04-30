fire-load-later
===============

Include this script to control when to fire the load (as in window.onload) event.

Why do this? 
If you use something like Postscribe (https://github.com/krux/postscribe) to make the advertising asynchronous, some or all advertising might be fetched after the load event (when the whole document finished loading). There are advertising campaigns which unite more advertising slots on the page and start animations synchronously. These advertising campaigns use the load event as the trigger for starting the animations and if the load event already fired, they will wait forever.

By proxying all load (onload in old IE) event handlers you can trick them into running on demand.

Tested in Internet Explorer 7, 8, 9  and 11, Chrome 33 and 34, Firefox 29.0, Opera 9.80.

# Usage

Include loadlater.js early (before any advertising) in your page:

    <script src="./loadlater.js"></script>

Call global (window) function fireLoad() to run all the registered load event handlers, regardless of the way they were registered. Do this after all advertising finished loading.

    // somewhere after the whole advertising loaded
    window.fireLoad();

In older IE you also need a script on DOM ready to move the window.onload = handler to document.attachEvent('onload', handler),
because older JavaScript versions cannot do Object.defineProperty and window.onload remains just a public field.
Easiest way to have a DOM Ready script in Internet Explorer is to use defer:

    <script defer>
        if(typeof document.attachEvent === 'function'){ // older IE
            if(window.onload){
                document.attachEvent('onload', window.onload);
                window.onload = null;
            }
        }
    </script>

