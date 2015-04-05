//=========================================================================================
// #polynomial

//  examplePoly  ===  5*x^3 + 3*x + 1
examplePoly = [ 1, 0, 3, 5 ];

function simplifyPoly( poly )
{
	while ( poly.length > 0  &&  getLastArrayElement( poly ) === 0 )
		poly.pop();
	return poly;
}

copyPoly = copyArray;

function calcPoly ( poly, x )
{
	var res = 0;
	iterateArrayBack( poly, function ( coeff )
	{
		res = res * x + coeff;
	});
	return res;
}

function getPolyFunc ( poly )
{
	return function ( x )
	{
		return calcPoly( poly, x );
	};
}

function getPolyDeg ( poly )
{
	return poly.length - 1;
}

function transformPolyToDerivative ( poly )
{
	iterate( getPolyDeg( poly ), function ( i )
	{
		poly[ i ] = poly[ i + 1 ] * (i + 1);
	});
	poly.pop();
	return poly;
}

function getPolyDerivative ( poly )
{
	return transformPolyToDerivative( copyPoly( poly ) );
}

function transformPolyToIntegral ( poly, freeConst /*= 0 */ )
{
	freeConst = getFirstDefined( freeConst, 0 );

	iterateBack( poly.length, function ( i )
	{
		poly[ i + 1 ] = poly[i] / i;
	});
	poly[ 0 ] = freeConst;
	
	return poly;
}

function getPolyIntegral ( poly, freeConst /*= 0 */ )
{
	return transformPolyToIntegral( copyPoly( poly ), freeConst );
}

//=========================================================================================

function polyScaleAdd ( destPoly, srcScale, srcPoly )
{
	var len = max( p.length, q.length );
	iterate( len, function ( i )
	{
		destPoly[ i ] = undef0( destPoly[ i ] ) + srcScale * undef0( srcPoly[ i ] );
	});
	return simplifyPoly( destPoly );
}

function polyAdd ( destPoly, srcPoly )
{
	return polyScaleAdd( destPoly, 1, srcPoly );
}

function polySub ( destPoly, srcPoly )
{
	return polyScaleAdd( destPoly, -1, srcPoly );
}

function polyScale ( destPoly, scale )
{
	return polyScaleAdd( destPoly, scale, [] );
}

function polyMul ( a, b )
{
	var res = makeArray( getPolyDeg(a) + getPolyDeg(b) + 1 );
	iterateArray( a, function ( aCoeff, aDeg )
	{
		iterateArray( b, function ( bCoeff, bDeg )
		{
			res[aDeg + bDeg] += aCoeff * bCoeff;
		});
	});
	return res;
}

function polyDiv ( a, b )
{
	throw 'Error: polynomial division is not implemented';
}

//=========================================================================================

function findPolyZeros ( poly )
{
	throw 'Error: finding of polynomial zeros functionality is not implemented';
}

//=========================================================================================
