// !!! IMPORTANT: keep sections names lowercase, so that they match JSON section labels.
import home from 'sections/Home';
import projects from 'sections/Projects';
import contact from 'sections/Contact';

import preloader from 'ui/DefaultPreloader';
import SectionTransitions from 'utils/SectionTransitions';


const SETTINGS = {
	reporting: true,											// exposes debug logging
	sections_container_id: 'appSections',						// container in index.html for sections/pages.
	menu_container_id: 'appMenu',								// container menu UI
	json_url: 'json/main.json', 								// JSON location
bulk_preload: false,										// preload all sections up front
	section_transition: SectionTransitions.CoverLeftToRight,	// transition preset
	section_transition_duration: 0.4,							// legnth of section transition
	section_classes: {											// map of section classes. Gets pulled into dynamic class, "SectionsFactory.js"
		home, 
		projects,
		contact
	},
	internal_section_classes: {
		preloader
	}
};

export default SETTINGS;