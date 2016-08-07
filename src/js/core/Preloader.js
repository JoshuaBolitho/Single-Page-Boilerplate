/*******************************************************
**  
**  
**
**  Inheritance Map:
**    this > Section > Events
**
*******************************************************/

import config from 'config/Config';

import Section from 'core/Section';
import BulkLoader from 'utils/BulkLoader';


class Preloader extends Section {

    
    constructor (id, data, template) {

        console.log('\nPRELOADER CONSTRUCTOR');
        console.log('- batch preload:', config.bulk_preload);

        super(id, data, template);
    }

    /*******************************************************
    ** 
    **  called on demand, to help mitigate initial CPU load.
    **
    *******************************************************/

    initialize () {

        if (!this.initialized) {

            // only perform once
            this.initialized = true;

            // loads batches of assets
            this.bulkLoader = new BulkLoader();
            this.bulkLoader.on('LOAD_PROGRESS', this.on_LOAD_PROGRESS.bind(this));
            this.bulkLoader.on('LOAD_COMPLETE', this.on_LOAD_COMPLETE.bind(this));
            
            // set HTML to DOM
            this.parentEl.innerHTML = this.html;
        }
    }

    /*******************************************************
    ** 
    **  Gets passed an object with all the preload assets
    **  and holds it for when loadList() gets called.
    **
    *******************************************************/

    prepLoadList (list, callback) {

        // store here for when loadList gets called.
        this._list = list;

        // only want a single instance of this function.
        this._bulkLoadCompleteFn = callback;
    }


    /*******************************************************
    ** 
    **  Initiates assets load
    **
    *******************************************************/

    loadList () {

        if (this._list) {
            this.bulkLoader.loadList(this._list);    
        } else {
            console.log('Error: loadList could not be found. Make sure it is first set in prepLoadList()')
        }
    }


    /*******************************************************
    ** 
    **  functions to be overwritten by inheriting class
    **
    *******************************************************/

    close () {
        if (this._bulkLoadCompleteFn) this._bulkLoadCompleteFn(); 
    }

    on_LOAD_PROGRESS (perc) {

    }

    on_LOAD_COMPLETE () {
        this.close();
    }

}

export default Preloader;