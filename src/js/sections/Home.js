/*******************************************************
**  
**  Main wrapper for pages
**
*******************************************************/

import template from 'sections/home.mustache';

import config from 'config/Config';
import Section from 'core/Section';

class Home extends Section {
    
    constructor (id, sectionData) {

       // runs all the template loading
       super(id, sectionData, template);
    }

    introBegin () {

    }

    introEnd () {

    }

    outroBegin () {

    }

    outroEnd () {

    }
}

export default Home;