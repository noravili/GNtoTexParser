//=========================================================================================
// #js

toInt = Math.floor;
roundToInt = Math.round;

function div ( a, b )
{
	return Math.floor( a / b );
}

//=========================================================================================

function iterate ( n, callback )
{
	if ( typeof n !== 'number' )
		throw 'Error: iterate function called with not a number as first argument';

	if ( typeof callback !== 'function' )
		throw 'Error: iterate function called with not a function as second argument';

	for ( var i = 0; i < n; i += 1 )
	{
		var ret = callback( i );
		if ( ret !== undefined )
			return ret;
	}
}

function iterateBack ( n, callback )
{
	return iterate( n, function ( i )
	{
		return callback( n - i - 1 );
	});
}

function iterateArray ( arr, callback )
{
	if ( typeof callback !== 'function' )
		throw 'Error: iterateArray function called with not a function as second argument';

	return iterate( arr.length, function ( i )
	{
		var ret = callback( arr[i], i );
		if ( ret !== undefined )
			return ret;
	});
}

function iterateArrayBack ( arr, callback )
{
	return iterateBack( arr.length, function ( index )
	{
		return callback( arr[ index ], index );
	});
}

//=========================================================================================

function choose ( x )
{
	return typeof x === 'object' && x.type === choose ? x.value : x;
}

function C ( x )
{
	return x === undefined || (typeof x === 'number' && isNaN(x)) ? undefined : { type: choose, value: x };
}

function B ( x )
{
	return x === false ? undefined : x;
}

//=========================================================================================

function getFirstDefined ()
{
	return iterateArray( arguments, function ( arg )
	{
		if ( arg !== undefined )
			return arg;
	});
}

function undef0 ( x )
{
	return ( x === undefined ? 0 : x );
}

function checkNumb ( x )
{
	return ( typeof x === 'number' ) && ! isNaN( x ) ? x : undefined;
}

function convertDefinedToInt( x )
{
	return ( x === undefined ? 0 : 1 );
}

function countDefined ()
{
	var res = 0;
	iterateArray( arguments, function ( arg )
	{
		if ( arg !== undefined )
			res += 1;
	});
	return res;
}

function areAllDefined ()
{
	return ! iterateArray( arguments, function ( arg )
	{
		if ( arg === undefined )
			return true;
	});
}

//=========================================================================================

function iterateObject ( object, callback )
{
	for ( var propertyName in object )
		if ( object.hasOwnProperty( propertyName ) )
		{
			var ret = callback( propertyName, object[ propertyName ] );
			if ( ret !== undefined )
				return ret;
		}
}

function getOwnProperties ( object )
{
	var array = [];
	for ( var propertyName in object )
		if ( object.hasOwnProperty( propertyName ) )
			array.push( propertyName );
	return array;
}

function copyObject( sourceObject /*= {}*/, propertyNames /*= getOwnProperties( sourceObject ) */ )
{
	if ( sourceObject === undefined )
		sourceObject = {};
	if ( propertyNames === undefined )
		propertyNames = getOwnProperties( sourceObject );

	var newObject = {};
	iterateArray( propertyNames, function ( propertyName )
	{
		newObject[ propertyName ] = sourceObject[ propertyName ];
	});
	return newObject;
}

function tryGetProperty ( object /*, propertyName1, ... */ )
{
	for ( var i = 1; i < arguments.length; i += 1 )
	{
		if ( object === undefined )
			return;
		var propertyName = arguments[ i ];
		object = object[ propertyName ];
	}
	return object;
}

function canGetProperty ( /* object, propertyName1, ... */ )
{
	return tryGetProperty.apply( this, arguments ) !== undefined;
}

function copyProperties ( sourceObject, destinationObject, propertyNames /*= getOwnProperties( sourceObject ) */)
{
	if ( propertyNames === undefined )
		propertyNames = getOwnProperties( sourceObject );
		
	iterateArray( propertyNames, function ( propertyName )
	{
		if ( sourceObject[ propertyName ] !== undefined )
			destinationObject[ propertyName ] = sourceObject[ propertyName ];
	});
}

function getUnionObject ( /* ... */ )
{
    var res = {};
    iterateArray( arguments, function ( object )
    {
        copyProperties( object, res );
    });
    return res;
}

//=========================================================================================

function argRetFunc ( x )
{
	return x;
}

function getConstRetFunc ( constant )
{
	return function ()
	{
		return constant;
	};
}

zeroRetFunc = getConstRetFunc( 0 );

//=========================================================================================

function makeArray_callback ( elementsNumber, getElementFromIndex )
{
	var array = [];
	iterate( elementsNumber, function ( index )
	{
		array.push( getElementFromIndex( index ) );
	});
	return array;
}

function makeArray_value ( elementsNumber, elementValue )
{
	return makeArray_callback( elementsNumber, getConstRetFunc( elementValue ) );
}

function makeArray ( elementsNumber, elementValue /*= 0 */ )
{
	return makeArray_value( elementsNumber, elementValue === undefined ? 0 : elementValue );
}

//=========================================================================================

function copyArray ( array, beginIndex /*= 0 */, endIndex /*= array.length */ )
{
	beginIndex = getFirstDefined( beginIndex, 0 );
	endIndex = getFirstDefined( endIndex, array.length );
	return array.slice( beginIndex, endIndex );
}

function copyArray_begLen ( array, beginIndex, elementsNumber )
{
	return copyArray( array, beginIndex, beginIndex + elementsNumber );
}

//=========================================================================================

function isArrayEmpty ( array )
{
	return array.length === 0;
}

//=========================================================================================

function getLastArrayIndex ( array )
{
	return array.length - 1;
}

function getLastArrayElement ( array )
{
	if ( array.length === 0 )
		throw 'Error: trying to get last element of an empty array';

	return array[ array.length - 1 ];
}

function setLastArrayElement( array, val )
{
	if ( array.length === 0 )
		throw 'Error: trying to get last element of an empty array';

	array[ array.length - 1 ] = val;
}

//=========================================================================================

function moveFixedArrayElements ( array, begIndex, endIndex, offset )
{
	var i;

	if ( offset > 0 )
	{
		i = endIndex + offset;
		if ( i >= array.length )
			i = array.length - 1;
		while ( true )
		{
			if ( i < begIndex )
				return;
			array[ i ] = array[ i - offset ];
			i -= 1;
		}
	}
	else
	{
		i = begIndex + offset;
		if ( i < 0 )
			i = 0;
		while ( true )
		{
			if ( i >= endIndex )
				return;
			array[ i ] = array[ i - offset ];
			i += 1;
		}
	}
}

function moveFixedArrayElements_params ( array, params )
{
	var begIndex = choose( C(params.begIndex) || C(params.endIndex - params.elementsNumber) || C(0) );
	var endIndex = choose( C(params.endIndex) || C(params.begIndex + params.elementsNumber) || C(array.length));
	var offset = choose( C(params.offset) || C(1) );
	moveFixedArrayElements( array, begIndex, endIndex, offset );
}

//=========================================================================================

function insertFixedArrayElement ( array, elementIndex, elementValue )
{
	moveFixedArrayElements( array, elementIndex, array.length, 1 );
	array[ elementIndex ] = elementValue;
}

//=========================================================================================

function sumArrayElements ( array, getValFromElement /*= argRetFunc */ )
{
	getValFromElement = choose( C( getValFromElement ) || C( argRetFunc ) );

	var sum = 0;
	iterateArray( array, function ( elem, index )
	{
		sum += getValFromElement( elem, index );
	});
	return sum;
}

//=========================================================================================

function transformArrayElements ( array, setElement )
{
	iterateArray( array, function ( element, index )
	{
		setElement( element, index );
	});
	return array;
}

function getTransformedArray ( array, getNewElement )
{
	var newArray = [];
	iterateArray( array, function ( element, index )
	{
		newArray.push( getNewElement( element, index ) );
	});
	return newArray;
}

//=========================================================================================

function setArrayElements ( array, elementValue )
{
	return transformArrayElements( array, function ( _, index )
	{
		array[ index ] = elementValue;
	});
}

//=========================================================================================

function copyArrayElements ( sourceArray, destinationArray, startDestIndex /*= 0 */ )
{
	startDestIndex = getFirstDefined( startDestIndex, 0 );
	
	iterateArray( sourceArray, function ( value, index )
	{
		destinationArray[ startDestIndex + index ] = value;
	});
}

//=========================================================================================

function tryConvertToNumber ( x, failReturnValue /*= 0*/)
{
	failReturnValue = getFirstDefined( failReturnValue, 0 );

	if ( typeof x === 'string' )
		x = parseFloat( x );

	if ( typeof x === 'number' && ! isNaN( x ) )
		return x;

	return failReturnValue;
}

//=========================================================================================

function getReversedString ( s )
{
	return s.split('' ).reverse().join('');
}

function getCodeFromChar( char )
{
	return char.charCodeAt( 0 );
}

function getCharFromCode ( code )
{
	return String.fromCharCode( code );
}

function isCharSmallLetter ( char )
{
	return char >= 'a' && char <= 'z';
}

function isCharCapitalLetter ( char )
{
	return char >= 'A' && char <= 'Z';
}

function isCharLetter ( char )
{
	return ( char >= 'a' && char <= 'z' ) || (  char >= 'A' && char <= 'Z'  );
}

//=========================================================================================

function numberLessComparator ( a, b )
{
	return a < b;
}

function numberCmpComparator ( a, b )
{
	return a - b;
}

function getCmpFromLessComparator ( lessComparator )
{
	return function ( a, b )
	{
		if ( lessComparator( a, b ) )
			return -1;
		if ( lessComparator( b, a ) )
			return 1;
		return 0;
	};
}

function getLessFromCmpComparator ( cmpComparator )
{
	return function ( a, b )
	{
		return cmpComparator( a, b ) < 0;
	};
}

//=========================================================================================

function sortArray ( array, lessComparator /*= numberLessComparator */ )
{
	array.sort( lessComparator === undefined ? undefined : getCmpFromLessComparator( lessComparator ) );
	return array;
}

//=========================================================================================

function binarySearch ( array, searchVal, lessComparator /*= numberLessComparator */ )
{
	lessComparator = getFirstDefined( lessComparator, numberLessComparator );
	
	var beg = 0;
	var end = array.length;
	
	while (true)
	{
		if ( end === beg )
			return beg;
	
		var mid = div( beg + end, 2 );
		// console.log( 'BINARY_SEARCH', mid );
		
		if ( lessComparator( array[ mid ], searchVal  ) )
			beg = mid + 1;
		else
			end = mid;
	}
}

//=========================================================================================

function binarySearchEnd ( array, searchVal, lessComparator /*= numberLessComparator */ )
{
	lessComparator = getFirstDefined( lessComparator, numberLessComparator );
	
	var beg = 0;
	var end = array.length;
	
	while (true)
	{
		if ( end === beg )
			return beg;
	
		var mid = div( beg + end, 2 );
		
		if ( lessComparator( searchVal, array[ mid ] ) )
			end = mid;
		else
			beg = mid + 1;
	}
}

//=========================================================================================

function getDOMElementPageOffset ( elem )
{
	var x = 0;
	var y = 0;

	for ( ; elem; elem = elem.offsetParent )
	{
//		x += elem.offsetLeft - elem.scrollLeft;
//		y += elem.offsetTop - elem.scrollTop;

		x += elem.offsetLeft;
		y += elem.offsetTop;

	}

	return vec( x, y );
}

//=========================================================================================

function getEventPos ( event )
{
	var offset = getDOMElementPageOffset( event.target );
	var pagePos = vec( event.pageX, event.pageY );
	var pos = vecSub( pagePos, offset );
	return pos;
}

//=========================================================================================

//function convertPositionalNumeralSystems ( numberArrayInA, digitsA, digitsB )
//{
//	iterateArray( numberArrayInA, function ( digitA ) );
//}
//
//function decToHex ( /* dec1, ... */ )
//{
//	var res = [];
//	iterateArray( arguments, function ( dec )
//	{
//		return
//	});
//}

//=========================================================================================
