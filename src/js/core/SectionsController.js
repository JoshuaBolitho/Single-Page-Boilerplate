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


const STATE_BOOT = 0;
const STATE_IDLE = 1;
const STATE_PRELOAD = 2;
const STATE_TRANSITION = 3;

class SectionsController {

    
    constructor (sectionsData) {

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

            // keeps the JSON from needing a redundant parameter.
            sectionData.id = sectionId;

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

        // checks to see if
        this.currentSection = this.prepSection(sectionId, currentSection);

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

        for (var i = 0, l = this.sectionsMap.length; i < l; i++) {
            this.sectionsMap[i].resize(w, h);
        }

        this.preloader.resize(w, h);
    }

}

export default SectionsController;