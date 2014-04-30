fire-load-later
===============

Include this script to control when to fire the load (as in window.onload) event.

Why do this? 
If you use something like Postscribe (https://github.com/krux/postscribe) to make the advertising asynchronous, some or all advertising might be fetched after the load event (when the whole document finished loading). There are advertising campaigns which unite more advertising slots on the page and start animations synchronously. These advertising campaigns use the load event as the trigger for starting the animations and if the load event already fired, they will wait forever.

By proxying all load (onload in old IE) event handlers you can trick them into running on demand.

Tested in Internet Explorer 7, 8, 9  and 11, Chrome 33 and 34, Firefox 29.0, Opera 9.80.