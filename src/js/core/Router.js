/*******************************************************
**	
**	Handles interal, client-side routing since all 
**	server requests are directed to root(index.html).
**
**	Also putting page history and browser-level
**	navigation events for now.
**
*******************************************************/

import config from 'config/Config';
import History from 'core/History';
import EventEmitter from 'events';

var instance = null;

class Router extends EventEmitter {
	
	
	constructor (sections) {

		super();

		this.sections = sections;

		if (config.reporting) {
			console.log('\nROUTER CONSTRUCTOR');
			console.log('- paths:', this.getURLPaths());
			console.log('- route:', this.getRoute());
		}

		// HTML5 history manager
		this.history = new History();
		this.history.addEventListener('StateChange', this.on_STATE_CHANGE.bind(this));
		
		if (!instance) {
			instance = this;
		}

		return instance;
	}


	/*************************************************
	**	
	**	returns array of the current URL paths
	**
	*************************************************/

	getURLPaths () {
        return window.location.pathname.split( '/' );
	}


	/*************************************************
	**	
	**	default is the first section in the JSON
	**
	*************************************************/

	getDefaultSection () {

		for (let section in this.sections) {
			return section;
		}
	}


	/*************************************************
	**	
	**	returns current route in the address bar
	**
	*************************************************/

	getRoute () {

		// NOTE: only one level of routing for now

		var routeRequest = this.getURLPaths()[1];
		
		routeRequest = this._validateRoute(routeRequest);
		
		return routeRequest;
	}


	/*************************************************
	**	
	**	returns current route in the address bar
	**
	*************************************************/

	_validateRoute (routeRequest) {

		var routeExists = false;

		if (routeRequest === '') {

			// root path, so just serve the default
			routeRequest = this.getDefaultSection();

		} else {

			// check if matching section name exists
			for (let section in this.sections) {
				
				if (routeRequest === section) {
					routeExists = true;
					break;
				}
			}

			// not a valid route
			if (routeExists == false) {
				routeRequest = '404';	
			}
		}

		return routeRequest;
	}


	/*************************************************
	**	
	**	register the section change to history. Once
	**	registered to HTML5 history API, a 
	**	"StateChange" event will pass the new
	**	sectionID.
	**
	*************************************************/

	navigate (section) {

		section = this._validateRoute(section);

		var path = (section === this.getDefaultSection()) ? null : section;

		this.history.pushState(section, path);
	}


	/*************************************************
	**	
	**	ChangeState events are triggered
	**	either by are router.navigate() requests or
	**	browser navigation, such as back and forward
	**	buttons.
	**
	*************************************************/

	on_STATE_CHANGE (section, url) {
		
		var path = this.getURLPaths()[1];

		section = this._validateRoute(path);

		this.emit('ROUTE_CHANGE', section);
	}

}

export default Router;