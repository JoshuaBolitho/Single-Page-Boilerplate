/*******************************************************
**	
**	Data store with built-in JSON loading.
**
*******************************************************/

import config from 'config/Config';
import JSONLoader from 'utils/JSONLoader';


let instance = null;

class Model {
	
	constructor () {

		// ES6 singleton pattern

		if (!instance) {
			instance = this;
		}

		if (config.reporting) {
			console.log('\nMODEL CONSTRUCTOR');
		}
		
		return instance;
	}


	_debugReport () {

		if (config.reporting) {

			console.log('- json loaded:', true);

			var sectionTxt = '- sections: | ';
			for (let section in this.sections) {
				sectionTxt += section + ' | ';
			}

			console.log(sectionTxt);
		}
	}


	/*************************************************
	**	
	**	Loads external JSON which is used to generate 
	**	the site's structure.
	**
	*************************************************/

	loadJSON (url, callback) {
		
		this._loadCallbackFn = callback;

		this.response = null;
		this.jsonLoader = new JSONLoader();
		this.jsonLoader.load(url, this.on_JSON_LOADED.bind(this));
	}


	on_JSON_LOADED (response) {

		this._separateData(response);
		this._debugReport();

		if (this._loadCallbackFn) {
			this._loadCallbackFn();
			this._loadCallbackFn = null;
		}
	}


	/*************************************************
	**	
	**	Organize data into smaller typed chunks 
	**
	*************************************************/

	_separateData (data) {
		this.data = data;
		this.sections = this._filterActiveSections(data.sections);
	}


	/*************************************************
	**	
	**	removes inactive sections from the list from
	**	here on forward.
	**
	*************************************************/

	_filterActiveSections (sectionsData) {

		for (var section in sectionsData) {

			if (sectionsData[section].settings.section_inactive) {
				delete sectionsData[section];
			}

			sectionsData[section].id = section;
		}

		return sectionsData;
	}

}

export default Model;