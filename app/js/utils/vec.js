//=========================================================================================
// #vec

function vec ( x, y )
{
	return { x: x, y: y };
}

function vecRound( x, y )
{
	return vec( roundToInt(x), roundToInt(y) );
}

function vecInt( x, y )
{
	return vec( toInt(x), toInt(y) );
}

function vecSquare( x )
{
	return vec( x, x );
}

vec0 = vecSquare( 0 );

function vecPolar ( len, angle )
{
	return vec( len * cos( angle ),  len * sin( angle ) );
}

function vecAdd ( v, w )
{
	return vec( v.x + w.x, v.y + w.y );
}

function vecAddX ( v, spanX )
{
	return { x: v.x + spanX, y: v.y };
}

function vecAddY ( v, spanY )
{
	return { x: v.x, y: v.y + spanY };
}

function vecInvert ( v )
{
	return { x: - v.x, y: - v.y };
}

function vecInvertX ( v )
{
	return { x: - v.x, y: v.y };
}

function vecInvertY ( v )
{
	return { x: v.x, y: - v.y };
}

function vecSub ( v, w )
{
	return vec( v.x - w.x, v.y - w.y );
}

function vecSubX ( v, spanX )
{
	return { x: v.x - spanX, y: v.y };
}

function vecSubY ( v, spanY )
{
	return { x: v.x, y: v.y - spanY };
}

function vecLen( v )
{
	return sqrt( v.x*v.x + v.y*v.y );
}

function vecAngle( v )
{
	return atan2( v.y, v.x );
}

function vecRotate( v, angle )
{
	return vecPolar( vecLen( v ), vecAngle( v ) + angle );
}

function vecSpan ( beg, end )
{
	return vecSub( end, beg );
}

function vecSpanLen ( beg, end )
{
	return vecLen( vecSpan( beg, end ) );
}

function vecScale ( v, scale )
{
	return vec(  v.x * scale,  v.y * scale  );
}

function vecSkewScale ( v, scaleVec )
{
	return vec(  v.x * scaleVec.x,  v.y * scaleVec.y  );
}

function vecScaleTo ( v, len )
{
	var vLen = vecLen( v );
	return vLen === 0 ? v : vecScale( v, len / vLen );
}

function vecScaleAdd ( v, scale, w )
{
	return vecAdd( v, vecScale( w, scale ) );
}

function vecSkewScaleAdd ( v, scaleVec, w )
{
	return vecAdd( v, vecSkewScale( w, scaleVec ) );
}

function vecFrac ( beg, end, frac )
{
	return vecScaleAdd( beg, frac, vecSpan( beg, end ) );
}

function vecSkewDiv ( v, w )
{
	return vec(  v.x / w.x,  v.y / w.y  );
}
// vecSkewScale( w, vecSkewDiv( v, w ) ) === v
// vecSkewScale( vecSkewDiv( v, w ), w ) === v

function toIntVec ( v )
{
	return vec( toInt(v.x), toInt(v.y) );
}

function roundToIntVec ( v )
{
	return vec( roundToInt( v.x ), roundToInt( v.y ) );
}

function getSizeVec ( obj )
{
	return vec( obj.width, obj.height );
}

//=========================================================================================

function isVecInRect_begEnd ( v, beg, end )
{
	return isValueInInterval( v.x, beg.x, end.x ) && isValueInInterval( v.y, beg.y, end.y );
}

function isVecInRect ( v, rect )
{
	return isVecInRect_begEnd ( v, rect.beg, rect.end );
}

function clipVec ( v, beg, end )
{
	return vec( clipValue( v.x, beg.x, end.x ), clipValue( v.y, beg.y, end.y ) );
}

function clipVec_rect ( v, rect )
{
	return clipVec( v, rect.beg, rect.end );
}

function clipVecCyclically( v, beg, end )
{
	return vec( clipValueCyclically( v.x, beg.x, end.x ), clipValueCyclically( v.y, beg.y, end.y ) );
}

function clipVecCyclically_rect ( v, rect )
{
	return clipVecCyclically( v, rect.beg, rect.beg );
}

function clipVecCyclically_rect ( v, rect )
{
	return clipVecCyclically( v, rect.beg, rect.end );
}

//=========================================================================================

function getRandomVec ( minX, maxX, minY, maxY )
{
	var x = getRandom( minX, maxX );
	var y = getRandom( minY, maxY );
	return vec( x, y );
}

function getRandomVec_rect ( rect )
{
	return getRandomVec( rect.beg.x, rect.end.x, rect.beg.y, rect.end.y );
}

//=========================================================================================
