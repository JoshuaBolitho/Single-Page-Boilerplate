/*******************************************************
**	
**	Wrapper class for the html5-history NPM module that
**	does all the heavy lifting for cross-browser 
**	support/normalization of the HTML5 history API.
**
*******************************************************/

import config from 'config/Config';
import historyHTML5 from 'html5-history';

var instance = null;

class History {
	

	constructor () {

		if (config.reporting) {
			console.log('\nHISTORY CONSTRUCTOR');
		}

		if (!instance) {
			instance = this;
		}

		return instance;
	}


	_debugReport () {

		if (config.reporting) {
			console.log('- popstate support: ', true);
		}
	}


	/*************************************************
	**	
	**	Keeping it simple for now, as it only expects
	**	a single listener.
	**
	*************************************************/

	addEventListener (type, callback) {

		if (type === 'StateChange') {

			// listen in tamden
			if (!this.active) {
				this.active = true;
				historyHTML5.Adapter.bind(window, 'statechange', this.on_STATE_CHANGE.bind(this));
			}
			
			this._stateChangeCallbackFn = callback; 
		}
	}


	/*************************************************
	**	
	**	Updates the address bar and state history in
	**	the browser.
	**
	*************************************************/

	pushState (section, path) {

        path = section ? '/' + section : '/';

        historyHTML5.pushState({section: section}, section, path);
	}


	/*************************************************
	**	
	**	Handles browser history back and forward 
	**	events.
	**
	*************************************************/

	on_STATE_CHANGE (e) {

		// Log the State
		var State = historyHTML5.getState();
		historyHTML5.log('statechange:', State.data, State.title, State.url);

		if (this._stateChangeCallbackFn) this._stateChangeCallbackFn(State.title, State.url);
	}

}

export default History;