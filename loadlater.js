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

    var fireEvent = function(){
        for(var i in handlers){ // map is only for modern browsers :(
            handlers[i].worker();
        }
        if(newLoad){newLoad.worker()}; // treated separately
    }

    var getReplacement = function(originalFunction, internalFunction){ // bind is only for modern browsers :(
        return function(event, handler, preventDefault){
            if (event != 'load' && event != 'onload'){
                return originalFunction(event, handler, preventDefault);
            }
            internalFunction(handler);
        }
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
    if (oldAttachEvent) d.attachEvent = getReplacement(d.attachEvent, add);
    if (oldDetachEvent) d.detachEvent = getReplacement(d.detachEvent, remove);

    // replace addEventListener and removeEventListener in IE9+, Firefox and Chrome
    if (oldAddEventListener) d.addEventListener = getReplacement(d.addEventListener, add);
    if (oldRemoveEventListener) d.removeEventListener = getReplacement(d.removeEventListener, remove);

    // fireLoad added to the window object for control over running the "load"/"onload" event handlers
    w.fireLoad = fireEvent;

})(document, window);