/*******************************************************
**	
**	Main wrapper for pages
**
*******************************************************/

import template from 'sections/projects.mustache';

import config from 'config/Config';
import Section from 'core/Section';

class Projects extends Section {
	
	constructor (id, sectionData) {
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

export default Projects;