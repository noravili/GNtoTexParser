//=========================================================================================
// #matrix

function makeMatrix( nRows, nCols, getMatrixElement /*= zeroRetFunc */ )
{
	getMatrixElement = getFirstDefined( getMatrixElement, zeroRetFunc );

	return makeArray( nRows, function ( iRow )
	{
		return makeArray( nCols, function ( iCol )
		{
			return getMatrixElement( iRow, iCol );
		});
	});
}

function makeSquareMatrix( n, getMatrixElement /*= zeroRetFunc */ )
{
	return makeMatrix( n, n, getMatrixElement );
}

//=========================================================================================

function copyMatrix ( matrix )
{
	return transformArrayElements( copyArray( matrix ), copyArray );
}

//=========================================================================================

function transformMatrixElements ( matrix, getNewElement )
{
	return transformArray( matrix, function ( row, iRow )
	{
		return transformArray( row, function ( val, iCol )
		{
			return getNewElement( val, iRow, iCol );
		});
	});
}

//=========================================================================================

function getMatrixRowsNumb ( matrix )
{
	return matrix.length;
}

function getMatrixColsNumb ( matrix )
{
	return ( matrix.length === 0 ? 0 : matrix[0].length );
}

function getMatrixCol ( matrix, iCol )
{
	return makeArray( getMatrixRowsNumb(), function ( iRow )
	{
		return matrix[iRow][iCol];
	});
}

function setMatrixCol ( matrix, iCol, col )
{
	if ( col.length !== getMatrixColsNumb( matrix ) )
		throw 'Error: trying to set matrix column of different size';

	iterateArray( col, function ( val, iRow )
	{
		matrix[ iRow ][ iCol ] = val;
	});
}

//=========================================================================================

function transposeMatrix ( matrix )
{
	return makeMatrix( getMatrixColsNumb( matrix ), getMatrixRowsNumb( matrix ),
		function ( iRow, iCol )
		{
			return matrix[ iCol ][ iRow ];
		});
}

//=========================================================================================

function calcMatrixDeterminant ( matrix )
{
	var nRows = getMatrixRowsNumb( matrix );
	var nCols = getMatrixColsNumb( matrix );

	if ( nRows !== nCols )
		throw 'Error: trying to calculate determinant of a not sqare matrix';
		
	var n = nRows;
	
	var m = matrix;
	
	if ( n === 0 )
		throw 'Error: trying to calculate determinant of a matrix of size 0x0';
	
	if ( n === 1 )
		return m[0][0];
	
	if ( n === 2 )
		return m[0][0]*m[1][1] - m[0][1]*m[1][0];
		
	if ( n === 3 )
		return m[0][0]*m[1][1]*m[2][2] + m[0][1]*m[1][2]*m[2][0] + m[0][2]*m[1][0]*m[2][1] -
			m[0][0]*m[1][2]*m[2][1] - m[0][1]*m[1][0]*m[2][2] - m[0][2]*m[1][1]*m[2][0];
	
	throw 'Error: calculating the determinant of matrix of size more than 3x3 is not implemented';
}

//=========================================================================================
