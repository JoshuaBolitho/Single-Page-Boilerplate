/*******************************************************
**  
**  Base class for views. Handles template rendering,
**  preload list, and general visual states.
**
**  Inheritance Map:
**    this > Events
**
*******************************************************/

import config from 'config/Config';
import EventEmitter from 'events';

class Section extends EventEmitter {
    

    constructor (id, sectionData, template) {

        super();

        this.id = id;
        this.sectionData = sectionData || {};
        this.template = template || '<div>Template "' + this.id + '" not found</div>';

        // render hogan.js object with json data to get rendered HTML string
        this.html = this.renderTemplate(this.template, this.sectionData.html);

        // list of all the preloadable assets, so that they can preloaded and added to cache
        this.preloadList = this.getPreloadList(this.template.text);
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

            // set HTML to DOM
            this.parentEl.innerHTML = this.html;
        }
    }


    /*******************************************************
    **  
    **  Scans HTML string from precompiled hogan.js module
    **  for preloadable content.
    **
    *******************************************************/

    getPreloadList (templateString) {

        var list = {};

        list.images = this._pullImageURLSFromTemplateString(templateString);

        // TODO: return other preloadable content, such as scripts and svgs.
        // example: list.concat(this._pullSVGFromTemplateString(templateString));

        // counts files to be preloaded
        var loadCount = 0;
        for (var preloadType in list) {
            loadCount += list[preloadType].length;
        }

        // null will block the preloader from trying to load anything
        if (loadCount < 1) {
            list = null;
        } else {
            list.count = loadCount;
        }

        return list;
    }


    /*******************************************************
    ** 
    **  Renders hogan.js compilation object using JSON data.
    **
    *******************************************************/

    renderTemplate (template, data) {

        // bypass render if template is already an HTML string
        return (template.render) ? template.render(data) : template;
    }


    /*******************************************************
    ** 
    **  returns an array of src urls from all the img 
    **  elements in the HTML string.
    **
    *******************************************************/

    _pullImageURLSFromTemplateString (templateStr) {

        var img_pattern = /(<img [^>]*src=")([^"]+)("[^>]*)>/g;
        var results;
        var arr = [];

        while ((results = img_pattern.exec(templateStr)) !== null) {
            arr.push(results[2]);
        }

        return arr;
    }


    /*******************************************************
    ** 
    **  This gets called automatically by the
    **  SectionsController, parent element gets created at
    **  that level.
    **
    *******************************************************/

    assignParentContainer (parent) {
        this.parentEl = parent;
    }


    /*******************************************************
    ** 
    **  Pulls DOM element in/out of all browser render/paint
    **  operations. Be cautious when calling manually, since
    **  they're meant to only be called by 
    **  SectionsController.js
    **
    *******************************************************/

    displayOn () {
        this.parentEl.style.visibility = 'visible';
        this.parentEl.style.display = 'block';
    }


    displayOff () {
        this.parentEl.style.visibility = 'hidden';
        this.parentEl.style.display = 'none';
    }


    /*******************************************************
    ** 
    **  Placeholders meant to be overwritten by inheriting 
    **  class. Don't remove these unless you update the
    **  changeSection function in SectionsController.js
    **
    *******************************************************/

    introBegin () {

    }


    introEnd () {
        
    }


    outroBegin () {

    }


    outroEnd () {
        
    }

    resize () {

    }

}

export default Section;