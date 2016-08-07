// !!! IMPORTANT: keep sections names lowercase, so that they match JSON section labels.
import home from 'sections/Home';
import projects from 'sections/Projects';
import contact from 'sections/Contact';

import preloader from 'ui/DefaultPreloader';
import pagenotfound from 'ui/404';

import SectionTransitions from 'utils/SectionTransitions';


const SETTINGS = {
	reporting: true,											// exposes debug logging
	sections_container_id: 'appSections',						// container in index.html for sections/pages.
	menu_container_id: 'appMenu',								// container menu UI
	json_url: 'json/main.json', 								// JSON location
	bulk_preload: true,											// preload all sections up front
	section_transition: SectionTransitions.CoverLeftToRight,	// transition preset
	section_transition_duration: 0.5,							// legnth of section transition
	section_classes: {											// map of section classes. Gets pulled into dynamic class, "SectionsFactory.js"
		home, 
		projects,
		contact
	},
	internal_section_classes: {
		preloader,
		pagenotfound
	}
};

export default SETTINGS;