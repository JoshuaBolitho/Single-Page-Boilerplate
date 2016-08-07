/*******************************************************
**	
**	Menu
**
*******************************************************/

import config from 'config/Config';
import EventEmitter from 'events';

const MENU_DEFAULT_CLASS_NAME = ' menu-item-default';
const MENU_ACTIVE_CLASS_NAME = ' menu-item-active';

class Menu extends EventEmitter {

	
	constructor (sectionData, entrySection, template) {

		super();

		this.menuData = { 'sections': this.formatSectionData(sectionData) };
		this.html = template.render(this.menuData);
		this.populateDOM();

		this.setSection(entrySection);
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
			this.listItems[i].className = MENU_DEFAULT_CLASS_NAME;
			this.listItems[i].addEventListener('click', function(e) {
				_this.emit('MENU_SELECT', this.dataset.section);
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
	**	a custom menu label, or the default one: lowercase
	**	section naming in JSON.
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
	**	visual updates are triggered by Router.js, which
	**	calls this function after successful assigning a 
	**	new route.
	**
	*******************************************************/

	setSection (sectionID) {

		this.currentListItem = this.getListItemByDataID(sectionID);
		
		this.setActiveStyleRule(this.currentListItem);
		if (this.previousListItem) this.setDefaultStyleRule(this.previousListItem);
		
		this.previousListItem = this.currentListItem;
	}


	/*******************************************************
	**	
	**	Iterates through all the menu list items and returns
	**	the one with the matching dataID
	**
	*******************************************************/

	getListItemByDataID (dataID) {

		for (var i = 0; i < this.listItems.length; i++) {

			if (this.listItems[i].dataset.section === dataID) {
				return this.listItems[i];
			}
		}
	}


	/*******************************************************
	**	
	**	For coordinating with CSS
	**
	*******************************************************/

	setActiveStyleRule (listItem) {
		listItem.className = MENU_ACTIVE_CLASS_NAME;
	}

	setDefaultStyleRule (listItem) {
		listItem.className = MENU_DEFAULT_CLASS_NAME;
	}


	show () {
		this.el.style.display = 'inline-block'
		this.el.style.visibility = 'visible';
	}

	hide () {
		this.el.style.display = 'none';
		this.el.style.visibility = 'hidden';
	}

	resize (w, h) {

	}
}

export default Menu;