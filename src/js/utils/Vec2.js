class Vec2 {

	
	constructor (x, y) {

		this.x = x || 0.0;
		this.y = y || 0.0;
	}
	

	angle () {
		return Math.atan2(this.y, this.x);
	}


	set (x, y) {
		this.x = x; this.y = y;
	}


	copy ( v ) {
		this.x = v.x; this.y = v.y;
		return this;
	}

	
	lenStatic (x, y) {
		return Math.sqrt(x * x + y * y);
	}


	len () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}


	dot (x, y) {
		return this.x * v.x + this.y * v.y;
	}


	rotate ( r ) {
		var x = this.x,
			y = this.y,
			c = Math.cos(r),
			s = Math.sin(r);
		this.x = x * c - y * s;
		this.y = x * s + y * c;
	}


	setLen ( l ) {
		var s = this.len();
		if ( s > 0.0 ) {
			s = l / s;
			this.x *= s;
			this.y *= s;
		} else {
			this.x = l;
			this.y = 0.0;
		}
	}


	normalize () {
		this.setLen(1.0);
	}

}

export default Vec2;