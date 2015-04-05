//=============================================================================================================

function makeFixDeq ( elementsNumber )
{
	return {
		beg: 0,
		end: 0,
		arr: makeArray( elementsNumber + 1 )
	};
}

//=============================================================================================================

function isFixDeqEmpty ( deq )
{
	return deq.beg === deq.end;
}

//=============================================================================================================

function getFixDeqLength ( deq )
{
	var end = ( deq.end >= deq.beg ? deq.end : deq.end + deq.arr.length );
	return end - deq.beg;
}

//=============================================================================================================

function isFixDeqFull ( deq )
{
	return getFixDeqLength( deq ) === deq.arr.length - 1;
}

//=============================================================================================================

function pushFixDeqEnd ( deq, element )
{
	deq.arr[ deq.end ] = element;
	deq.end += 1;
	if ( deq.end === deq.arr.length )
		deq.end = 0;
}

//=============================================================================================================

function pushFixDeqBeg ( deq, element )
{
	deq.beg -= 1;
	if ( deq.beg === -1 )
		deq.beg = deq.arr.length - 1;
	deq.arr[ deq.beg ] = element;
}

//=============================================================================================================

function popFixDeqBeg ( deq, elementsNumber /*= 1 */ )
{
	if ( elementsNumber === undefined ) elementsNumber = 1;

	deq.beg += elementsNumber;
	if ( deq.beg > deq.arr.length )
		deq.beg -= deq.arr.length;
}

//=============================================================================================================

function popFixDeqEnd ( deq, elementsNumber /*= 1 */ )
{
	if ( elementsNumber === undefined ) elementsNumber = 1;

	deq.end -= elementsNumber;
	if ( deq.end < 0 )
		deq.end += deq.arr.length;
}

//=============================================================================================================

function getFixDeqBeg ( deq, i /*= 0*/ )
{
	if ( i === undefined ) i = 0;

	i += deq.beg;
	if ( i >= deq.arr.length )
		i -= deq.arr.length;
	return deq.arr[ i ];
}

//=============================================================================================================

function getFixDeqEnd ( deq, i /*= 0*/ )
{
	if ( i === undefined ) i = 0;

	i = deq.end - i - 1;
	if ( i < 0 )
		i += deq.arr.length;
	return deq.arr[ i ];
}

//=============================================================================================================

function setFixDeqBeg ( deq, i /*= 0*/, val )
{
	if ( val === undefined )
	{
		val = i;
		i = 0;
	}

	i += deq.beg;
	if ( i >= deq.arr.length )
		i -= deq.arr.length;
	deq.arr[ i ] = val;
}

//=============================================================================================================

function setFixDeqEnd ( deq, i /*= 0*/, val )
{
	if ( val === undefined )
	{
		val = i;
		i = 0;
	}

	i = deq.end - i - 1;
	if ( i < 0 )
		i += deq.arr.length;
	deq.arr[ i ] = val;
}

//=============================================================================================================

function iterateFixDeq ( deq, callback )
{
	var arr = deq.arr;
	var len = arr.length;
	var end = deq.end;

	var callbackIndex = 0;

	for ( var i = deq.beg; ; i += 1, callbackIndex += 1 )
	{
		if ( i === len )
			i = 0;

		if ( i === end )
			break;

		var ret = callback( arr[ i ], callbackIndex );
		if ( ret !== undefined )
			return ret;
	}
}

//=============================================================================================================
