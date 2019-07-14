/**************************************************
**
**	Main syncronization clock for entire
**	application. Just register update callbacks to 
**	ensure they never get out of sync with one 
**	another.
**
**************************************************/


let instance = null;


class MasterClock {


	// singleton
	constructor () {

		if (!instance) {
			this.initialize();
		}

		return instance;
	}


	initialize () {

		instance = this;

        this._started = Date.now();
        this._timeScale = 1.0;
        this.time = this._started;
        this._desiredFps = 60;
        this._desiredFrameDurationMS = 1000 / this._desiredFps;

        this._updates = [];
        this.eventObj = {};

        this.update();
	}


	/*********************************************
    **
    **	Starts the callback loop
    **
    *********************************************/

	play () {
        this.playing = true;
    }


    /*********************************************
    **
    **	Pauses the callback loop
    **
    *********************************************/

    pause () {
        this.playing = false;
    }


    /*********************************************
    **
    **	Sets time speed, in relation to 60fps
    **
    *********************************************/

    timeScale (rate) {

        if (rate) {
            this._timeScale = rate;
        }

        return this._timeScale;
    }


    /*********************************************
    **
    **	Register and unregister callback
    **	function that are to be called on each
    **	iteraction of the main update loop.
    **
    *********************************************/

    registerCallback (callback) {
        this._updates.push(callback);
    }


    unregisterCallback (callback) {

        var index = this._updates.indexOf(callback);

        if (index > -1) {
            this._updates.splice(index, 1);
        } else {
            throw new Error("Cannot get location of given callback.");
        }
    }


    /*********************************************
    **
    **	Records some time information for the 
    **	current frame and passes it to every 
    **	registered callback.
    **
    *********************************************/

    update () {

        window.requestAnimationFrame(this.update.bind(this));

        this.lastTime = this.time;

        this.time = Date.now();

        this.elapsedMS = this.time - this.lastTime;

        this.deltaScale = (this.elapsedMS / this._desiredFrameDurationMS) * this._timeScale;

        this.now = this.time;

        if (this.playing) {

            this.eventObj.now = this.now;
            this.eventObj.elapsed = this.elapsedMS;
            this.eventObj.delta_scale = this.deltaScale;

            for (var i = 0, l = this._updates.length; i < l; i++) {
                this._updates[i](this.eventObj);
            }
        }
    }
}

export default new MasterClock();