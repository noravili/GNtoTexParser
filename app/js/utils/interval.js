//=========================================================================================
// #interval

function makeInterval ( beg, end )
{
	return {
		beg: beg,
		end: end
	};
}

function makeInterval_begSpan ( beg, span )
{
	return makeInterval( beg, beg + span );
}

function getIntervalBeg ( interval )
{
	return interval.beg;
}

function getIntervalEnd ( interval )
{
	return interval.end;
}

function getIntervalSpan ( interval )
{
	return interval.end - interval.beg;
}

//=========================================================================================
