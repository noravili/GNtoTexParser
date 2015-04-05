//=========================================================================================
// #linearEquations

function solveLinearEquationsSystem_cramer ( cols, failReturnValue /*= undefined */ )
{
	var lastCol = cols.pop();
	
	var det = calcMatrixDeterminant( cols );
	
	if ( det === 0 )
		return failReturnValue;
		
	return makeArray( cols.length, function ( iCol )
	{
		var col = cols[ iCol ];
		cols[ iCol ] = lastCol;
		var detI = calcMatrixDeterminant( cols );
		cols[ iCol ] = col;
		return detI / det;
	});
}

//=========================================================================================
