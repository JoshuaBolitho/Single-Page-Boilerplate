/*******************************************************
**	
**	Menu
**
*******************************************************/

import config from 'config/Config';
import EventEmitter from 'events';


class Menu extends EventEmitter {

	
	constructor (sectionData, entrySection, template) {

		super();

		this.menuData = { 'sections': this.formatSectionData(sectionData) };
		this.html = template.render(this.menuData);
		this.populateDOM();

		this.currentSection = entrySection;
	}


	/*******************************************************
	**	
	**	Add main container, rendered template, and list 
	**	item listeners
	**
	*******************************************************/

	populateDOM () {

		// main menu container
		this.el = document.getElementById(config.menu_container_id);

		if (!this.el) console.log('Error: element with the given ID could not be found.');
		
		// set template
		this.el.innerHTML = this.html;

		// menu navigation links
		this.listItems = this.el.getElementsByTagName('li');

		// add mouse events to list items
		var _this = this;
		for (var i = 0; i < this.listItems.length; i++) {
			this.listItems[i].addEventListener('click', function(e) {
				_this.emit('SectionSelect', this.dataset.section);		
				_this.on_LIST_ITEM_CLICK(e, this);
			});
		}
	}


	/*******************************************************
	**	
	**	Takes the JSON data and returns a mustache friendly
	**	data object. This way the display can be dynamic
	**	and configurable.
	**
	*******************************************************/

	formatSectionData (sectionData) {

		var section;
		var arr = [];

		for (var sectionName in sectionData) {

			section = sectionData[sectionName];

			// dont add sections that were configured to be omitted from the menu.
			if (!section.settings.remove_from_menu) {

				// menu section labels shouldn't have to alway match section name.
				arr.push({id:section.id, label: this.getSectionLabel(section)});
			}
		}

		return arr;
	}


	/*******************************************************
	**	
	**	checks to see if section has been configured to use
	**	a custom menu label
	**
	*******************************************************/

	getSectionLabel (section) {

		var label;

		if (section.settings.menu_alias && section.settings.menu_alias != '') {
			label = section.settings.menu_alias;
		} else {
			label = section.id;
		}

		return label;
	}


	/*******************************************************
	**	
	**	Menu does not directly alter itself, instead all
	**	visual updates are triggered by router.
	**
	*******************************************************/

	setSection (section) {

		this.currentSection = section;
	}


	/*******************************************************
	**	
	**	menu link click event to be overwritten by 
	**	inheriting class.
	**
	*******************************************************/

	on_LIST_ITEM_CLICK (e, target) {

	}

	show () {

	}

	hide () {

	}

	resize (w, h) {

	}
}

export default Menu;