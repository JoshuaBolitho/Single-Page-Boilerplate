/*******************************************************
**	
**	Utility class for loading JSON files
**
*******************************************************/

class JSONLoader {

	
	constructor () {

	}


	/*************************************************
	**	
	**	Load external JSON files
	**
	*************************************************/

	load (url, callback) {

		var jsonLoadedCallbackFn = callback;

		var request = new XMLHttpRequest();
		request.onload = function (e) {
			this.on_REPLY.apply(this, [e, jsonLoadedCallbackFn]);
		}.bind(this);
		request.onerror = this.on_LOAD_ERROR.bind(this);
		request.open('GET', url, true);
		request.responseType = 'json';
		request.send();
	}


	/*************************************************
	**	
	**	Server responded. Need to ensure that the 
	**	response shows that everthing went alright.
	**
	*************************************************/

	on_REPLY (e, callback) {

		if (e.target.status >= 200 && e.target.status < 400) {
			
			var response = e.target.response;

			// convert to object if request is a JSON string
			if (typeof response === 'string') {
				response = JSON.parse(e.target.response);
			}

			// Go ahead and pass the response to the caller
			callback(response);

		} else {
			
			console.log('Error: There was an error loading the JSON. -- Status:', e.target.status);
		}
	}
	

	on_LOAD_ERROR (e) {
		console.log('Error: There was an error loading the JSON', e);
	}

}

export default JSONLoader;