/*******************************************************
**	
**	Menu
**
*******************************************************/

import template from 'ui/menu.mustache';

import config from 'config/Config';
import Menu from 'core/Menu';


class DefaultMenu extends Menu {

	
	constructor (sectionData, entrySection) {
		super(sectionData, entrySection, template);
	}

	// show () {

	// }

	// hide () {

	// }

	setSection (section) {
		console.log("SET SECTION MENU", section);
	}

	on_LIST_ITEM_CLICK (e, target) {
		console.log("LIST ITEM CLICK MENU", target.dataset.section);
	}

	resize (w, h) {

	}
}

export default DefaultMenu;