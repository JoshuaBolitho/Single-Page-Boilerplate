/*******************************************************
**  
**  Inherits section and mostly behaves the exact same
**  way, minus the background preloading and load
**  progress event that gets called from Preloader.js
**
**  Inheritance Map:
**    this > Preloader > Section > Events
**
*******************************************************/

import template from 'ui/preloader.mustache';

import config from 'config/Config';
import Preloader from 'core/Preloader';

class DefaultPreloader extends Preloader {
    
    constructor (id, sectionData) {

       // runs all the template loading t
       super(id, sectionData, template);
    }

    on_LOAD_PROGRESS (perc) {
        console.log('PROGRESS --------<>', perc);
    }

    on_LOAD_COMPLETE () {
        window.setTimeout(function(){
            this.close();
        }.bind(this), 1000);
    }

    introBegin () {

    }

    introEnd () {
        
        // starts the loading process in Preloader.js
        this.loadList();
    }

    outroBegin () {

    }

    outroEnd () {

    }

}

export default DefaultPreloader;