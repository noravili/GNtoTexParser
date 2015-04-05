//=========================================================================================
// #rect

function makeRect_begEnd ( beg, end )
{
	return {
		x1: beg.x,
		y1: beg.y,
		x2: end.x,
		y2: end.y
	};
}

function makeRect_begSpan ( beg, span )
{
	return {
		x1: beg.x,
		y1: beg.y,
		x2: beg.x + span.x,
		y2: beg.y + span.y
	};
}

//=========================================================================================

function getRectBeg ( rect )
{
	return rect.beg;
}

function getRectEnd ( rect )
{
	return rect.end;
}

function getRectSpan ( rect )
{
	return vecSpan( rect.beg, rect.end );
}

function getRectWidth ( rect )
{
	return rect.end.x - rect.beg.x;
}

function getRectHeight ( rect )
{
	return rect.end.y - rect.beg.y;
}

function getRectBeg ( rect )
{
	return rect.beg;
}

function getXInterval ( rect )
{
	return makeInterval( rect.beg.x, rect.end.x );
}

function getYInterval ( rect )
{
	return makeInterval( rect.beg.y, rect.end.y );
}

//=========================================================================================

getRectX1Y1 = getRectBeg;
getRectX2Y2 = getRectEnd;

function getRectX1Y2 ( rect )
{
	return vec( rect.beg.x, rect.end.y );
}

function getRectX2Y1 ( rect )
{
	return vec( rect.end.x, rect.beg.y );
}

//=========================================================================================
