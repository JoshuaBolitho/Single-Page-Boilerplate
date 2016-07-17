let instance = null;

class Utils {
	
	constructor () {

		console.log('UTILS CONSTRUCTOR');

		// singleton
		if (!instance) {
			instance = this;
		}

		return instance;
	}

}

export default Utils;