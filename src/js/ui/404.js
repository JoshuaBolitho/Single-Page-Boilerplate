/*******************************************************
**	
**	Main wrapper for pages
**
*******************************************************/

import template from 'ui/404.mustache';

import config from 'config/Config';
import Section from 'core/Section';

class PageNotFound extends Section {
	
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

export default PageNotFound;