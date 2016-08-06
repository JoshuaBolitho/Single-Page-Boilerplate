/*******************************************************
**  
**  Handles section creation and display management
**
**  TODO: Need to add destroy functionality to sections,
**  for larger sites with many views.
**
*******************************************************/

import config from 'config/Config';

// dynamic factory for getting section classes, including 
// internally  used ones, like preloader and 404.
import SectionFactory from 'core/SectionFactory';
import EventEmitter from 'events';


const STATE_BOOT = 0;
const STATE_IDLE = 1;
const STATE_PRELOAD = 2;
const STATE_TRANSITION = 3;

class SectionsController extends EventEmitter {

    
    constructor (sectionsData) {

        super();

        this._state = STATE_BOOT;

        // all the dynamic data for the page
        this.sectionsData = sectionsData;

        console.log('\nSECTION CONTROLLER CONSTRUCTOR');

        // top element for all section views
        this.viewContainer = document.getElementById(config.sections_container_id);

        // keeps reference to the names of all the section objects, for iterating
        this.sectionsMap = this.createSections();
        this.sectionsKey = this.createSectionsKey(this.sectionsMap);

        // preloader gets treated like a silent section. In fact, it inherits from section
        this.preloader = new SectionFactory('preloader', {});

        // idle state
        this._state = STATE_IDLE;
    }


    /*******************************************************
    ** 
    **
    **
    *******************************************************/

    startPreloader (sectionId, list, callback) {

        this._state = STATE_PRELOAD;
        this.emit('PRELOAD_ENTER');

        // initialize per first request
        if (!this.preloader.initialized) {

            var sectionEl = document.createElement('section');
            sectionEl.style.visibility = 'hidden';
            sectionEl.style.display = 'none';
            sectionEl.id = 'preloader';

            this.viewContainer.appendChild(sectionEl);

            this.preloader.assignParentContainer(sectionEl);
            this.preloader.initialize();
        }
        
        // async callback for when all the files load.
        this.preloader.prepLoadList(list, function () {

            this.emit('PRELOAD_EXIT');

            // callback is createSections(), now that 
            // everything has been loaded for requested 
            // section.
            if (callback) callback(sectionId);

        }.bind(this));
    }


    /*******************************************************
    ** 
    ** Creates all the sections listed in JSON that have
    ** matching classes registered to the dynamic section
    ** factory class: SectionFactory. Also creates and
    ** appends html containers to the main view container.
    **
    *******************************************************/

    createSections () {

        var sectionEl;
        var sectionData;
        var arr = [];

        for (var sectionId in this.sectionsData) {

            // current section's data
            sectionData = this.sectionsData[sectionId];

            // create section wrapper now to prevent having go through background-loading
            // HTML strings to dummy elements, just to be able append HTML. This also prevents
            // overwriting issues when using innerHTML = '<string>'.
            sectionEl = document.createElement('section');
            sectionEl.style.visibility = 'hidden';
            sectionEl.style.display = 'none';
            sectionEl.id = sectionId;

            // pass data to populate newly created section
            var section = new SectionFactory( sectionId, sectionData );

            // active sections must have an id, and if not, there was an issue with creation.
            if (section.id) {

                // SectionController creates top section element, but sections classes
                // need reference to it to inject HTML themselved.
                if (section.assignParentContainer) section.assignParentContainer(sectionEl);

                // add section wrapper to DOM
                this.viewContainer.appendChild(sectionEl);
            }

            // store list of active sections
            arr.push(section);
        }

       return arr;
    }


    /*******************************************************
    ** 
    ** Key for the section map list, for faster 
    ** referencing/lookup.
    **
    *******************************************************/

    createSectionsKey (map) {

        var key = {};

        for (var i = 0; i < map.length; i++) {
            key[ map[i].id ] = i;
        }

        return key;
    }


    /*******************************************************
    ** 
    ** Key for the section map list, for faster 
    ** referencing/lookup.
    **
    *******************************************************/

    changeSection (sectionId) {

        // TODO: Need to handle 404 pages
        if (sectionId === '404') {
            sectionId = 'home';
        }

        this._state = STATE_TRANSITION;

        var prevSection = this.currentSection;
        var currentSection = this.sectionsMap[ this.sectionsKey[sectionId] ];

        // checks to see if section/sections need initialization or preloadeding
        this.currentSection = (!config.bulk_preload) ? this.prepSection(sectionId, currentSection) : this.prepBulkSections(sectionId); 

        // add back to render list and trigger section intro
        this.currentSection.displayOn();
        this.currentSection.introBegin();

        // trigger exiting section's outro begin
        if (prevSection) prevSection.outroBegin();

        // transition get assigned in config
        config.section_transition(this.currentSection, prevSection, function(){
            
            this.currentSection.introEnd();

            if (prevSection) {
                prevSection.outroEnd();
                prevSection.displayOff();
            }

            this._state = STATE_IDLE;

        }.bind(this), config.section_transition_duration);
    }


    /*******************************************************
    ** 
    **  Rather than initializing/preloading sections per 
    **  request, just do them all up front.
    **
    *******************************************************/

    prepBulkSections (id, section) {

        var list = {
            count:0,
            images: []
        };
        
        // make sure buld load doesnt get triggered again.
        config.bulk_preload = false;

        for (var i = 0; i < this.sectionsMap.length; i++) {

            // make sure all sections are initialized and DOM layout is all set.
            if (!this.sectionsMap[i].initialized) {
                this.sectionsMap[i].initialize();
            }
            
            // merge all sections preloadable assets into a single load list object.
            if (this.sectionsMap[i].preloadList) {

                list.count += this.sectionsMap[i].preloadList.count;

                if (this.sectionsMap[i].preloadList.images.length > 0) {
                    list.images = list.images.concat(this.sectionsMap[i].preloadList.images);
                }
            }
            
            // if there are assets, send the bulk object for preload
            if (list.count > 0) {

                // play the preload cycle and then call change section to complete the task.
                this.startPreloader(id, list, this.changeSection.bind(this));

                // change section to prelaoder
                section = this.preloader;
            }
        }

        return section;
    }


    /*******************************************************
    ** 
    **  gets section ready to be displayed by making sure
    **  they are rendered and assets are preloaded. If there
    **  are assets to load, the preloader will get returned.
    **
    *******************************************************/

    prepSection (id, section) {

        // sets HTML to wrapper if not already done, since this is done at first request.
        if (!section.initialized) {
            
            // creates section and adds itself to reserved DOM section element
            section.initialize();

            // is there any assets that need preloading?
            if (section.preloadList) {

                // play the preload cycle and then call change section to complete the task.
                this.startPreloader(id, section.preloadList, this.changeSection.bind(this));

                // change section to prelaoder
                section = this.preloader;
            }
        }

        return section;
    }


    getState () {
        return this._state;
    }


    /*******************************************************
    ** 
    **  Resize all sections
    **
    *******************************************************/

    resize (w, h) {

        this.viewContainer.style.width = w + 'px';
        this.viewContainer.style.height = h + 'px';

        // TODO: should be switched to active sections only
        for (var i = 0, l = this.sectionsMap.length; i < l; i++) {
            this.sectionsMap[i].resize(w, h);
        }

        this.preloader.resize(w, h);
    }

}

export default SectionsController;