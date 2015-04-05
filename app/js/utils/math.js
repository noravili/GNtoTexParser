//=========================================================================================
// #math

floor = Math.floor;
ceil = Math.ceil;
round = Math.round;

abs = Math.abs;

sqrt = Math.sqrt;

min = Math.min;
getMin = Math.min;

max = Math.max;
getMax = Math.max;

//=========================================================================================

E = Math.E;

function exp ( base, exponent )
{
	return Math.pow( base, exponent );
}

function log ( base, x )
{
	return Math.log( x ) / Math.log( base );
}

//=========================================================================================

PI = Math.PI;

sin = Math.sin;
cos = Math.cos;

asin = Math.asin;
acos = Math.acos;

atan2 = Math.atan2;

// getAngleFromRadians
function rad ( x )
{
	return x;
}

// getAngleFromDegrees
function deg ( x )
{
	return ( PI * x ) / 180;
}

function getAngleDegrees ( angle )
{
	return ( 180 * x ) / PI;
}

function getAngleRadians ( angle )
{
	return angle;
}

//=========================================================================================

function getRandom ( min, max )
{
	var res = Math.random();
		// uniform random distributed in [0, 1)
	
	res = min + (max - min)*res;
	
	return res;
}

function getNormalDistributedRandom ( min, max )
{
	var res = ( getRandom( min, max ) + getRandom( min, max ) + getRandom( min, max ) ) / 3;
	return res;
}

//=========================================================================================

function isValueInInterval ( val, min, max )
{
	return ( (val >= min) && (val < max) );
}

function isValueInInterval_len ( val, min, len )
{
	return ( (val >= min) && (val < min + len) );
}

function isValueInInterval_interval ( val, interval )
{
	return ( val >= getIntervalBeg( interval ) ) && ( val < getIntervalEnd( interval ) );
}

//=========================================================================================

function clipValue ( val, min, max )
{
	if ( val < min )
		return min;
	if ( val > max )
		return max;
	return val;
}

function clipValueCyclically ( val, min, max )
{
	if ( val >= min  &&  val < max )
		return val;

	var len = max - min;
	var dist = ( val < min  ?  min - val  :  val - max );
	var clippedDist = dist % len;
	val = ( val < min  ?  max - clippedDist  :  min + clippedDist );
	
	return val;
}

function clipValue_interval ( val, interval )
{
	return clipValue( val, getIntervalBeg( interval ), getIntervalEnd( interval ) );
}

function clipValueCyclically_interval ( val, interval )
{
	return clipValueCyclically( val, getIntervalBeg( interval ), getIntervalEnd( interval ) );
}

//=========================================================================================

function getFracValue ( beg, end, frac )
{
	return beg + frac * ( end - beg );
}

function getFracValue_interval ( interval, frac )
{
	return getFracValue ( getIntervalBeg( beg), getIntervalEnd( end ), frac );
}

//=========================================================================================

function getValueFrac ( beg, end, value )
{
	return ( value - beg ) / ( end - beg );
}

//=========================================================================================

function getNumberFromBinaryChars ( binChars )
{
	var res = 0;

	var power = 1;
	iterateArrayBack( binChars, function ( char )
	{
		if ( char !== '0' && char !== '1')
			return;

		if ( char === '1' )
			res += power;

		power *= 2;
	});

	return res;
}

//=========================================================================================
