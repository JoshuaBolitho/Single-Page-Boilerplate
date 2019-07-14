let instance = null;

const PI2 = Math.PI * 2;

class MathPlus {


	constructor () {

		if (!instance) {
			instance = this;
		}

		return instance;
	}


	/****************************************
	**
	**  returns angle between 0,0 and x,y
	**
	****************************************/

	angle (x, y) {
		return Math.atan2(y, x);
	}


	/****************************************
	**
	**  returns distance between two vectors
	**
	****************************************/

	distanceBetweenVectors ( v1, v2 ) {

	    var dx = v1.x - v2.x;
	    var dy = v1.y - v2.y;

	    return Math.sqrt( dx * dx + dy * dy );
	}


	/****************************************
	**
	**  Checks if number is negative, 
	**	neutral, or positive. 
	**
	**	Returns -1 | 0 | 1
	**
	****************************************/

	sign (n) {
		// Allegedly fastest if we check for number type
		return typeof n === 'number' ? n ? n < 0 ? -1 : 1 : n === n ? 0 : NaN : NaN;
	}


	/****************************************
	**
	**  Clamp number between min and max.
	**
	****************************************/

	clamp (n, min, max) {
		return Math.min(Math.max(n, min), max);
	}


	normalizeAngle (angle) {

        var newAngle = angle;

        while (newAngle <= -Math.PI) newAngle += PI2;
        while (newAngle > Math.PI) newAngle -= PI2;

        return newAngle;
	}


	smallestDistanceBetweenTwoRadians (srcRadian, targetRadian) {

        var angle = targetRadian - srcRadian;

        return this.normalizeAngle(angle);
    }


	/****************************************
	**
	**  Always positive modulus.
	**
	****************************************/

	pmod (n, m) {
		return (n % m + m) % m;
	}
}

export default new MathPlus();