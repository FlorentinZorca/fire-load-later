(function loadLater(d, w){
    var oldAddEventListener = d.addEventListener;
    var oldRemoveEventListener = d.removeEventListener;
    var oldAttachEvent = d.attachEvent;
    var oldDetachEvent = d.detachEvent;
    var handlers = [];
    var newLoad;

    // bind this to the document
    var Bound = function(handler, that){
        this.handler = handler;
        this.worker = (typeof handler.bind === 'function')? handler.bind(that) : handler;
    }

    var add = function(handler){
        if (typeof handler === 'function') handlers.push(new Bound(handler, d));
    }

    var remove = function(handler){
        // filter is only for modern browsers :( => poor man's manual filter
        var dest = [];
        for(var i in handlers){
            if(handlers[i].handler === handler) continue;
            dest.push(handlers[i]);
        }
        handlers = dest;
    }

    var fireEvent = function(extraData){
        for(var i in handlers){ // map is only for modern browsers :(
            handlers[i].worker();
        }
        if(newLoad){newLoad.worker()}; // treated separately
    }

    var addEventListener = function(event, handler, preventDefault){
        if (event!='load'){
            return oldAddEventListener(event, handler, preventDefault);
        }
        add(handler);
    }

    var removeEventListener = function(event, handler, preventDefault){
        if (event!='load'){
            return oldRemoveEventListener(event, handler, preventDefault);
        }
        remove(handler);
    }

    var attachEvent = function(event, handler){
        if (event!='onload'){
            return oldAttachEvent(event, handler);
        }
        add(handler);
    }

    var detachEvent = function(event, handler){
        if (event!='onload'){
            return oldDetachEvent(event, handler);
        }
        remove(handler);
    }

    // replace onload field with a property (where available)
    if (typeof Object.defineProperty === 'function'){
        Object.defineProperty(w, "onload", {
            enumerable : false,
            configurable : false,
            set: function(handler){
                newLoad = (typeof handler === 'function')? new Bound(handler, d) : null;
            },
            get: function(){
                return (newLoad)? newLoad.handler : null;
            }
        });
    }

    // replace attachEvent and detachEvent in older IE
    if (oldAttachEvent) d.attachEvent = attachEvent;
    if (oldDetachEvent) d.detachEvent = detachEvent;

    // replace addEventListener and removeEventListener in IE9+, Firefox and Chrome
    if (oldAddEventListener) d.addEventListener = addEventListener;
    if (oldRemoveEventListener) d.removeEventListener = removeEventListener;

    // fireLoad added to the window object for control over running the "load"/"onload" event handlers
    w.fireLoad = fireEvent;

})(document, window);