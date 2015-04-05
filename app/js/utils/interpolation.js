//=========================================================================================
// #interpolation

function getCubicPolyInterpolation (  x1, y1, yy1,  x2, y2, yy2  )
{
	var colA = [  x1*x1*x1 - x2*x2*x2,  3*x1*x1,  3*x2*x2  ];
	var colB = [  x1*x1 - x2*x2,  2*x1,  2*x2  ];
 	var colC = [  x1 - x2,  1,  1  ];
	
	var freeCol = [  y1 - y2,  yy1,  yy2  ];
	
	var abc = solveLinearEquationsSystem_cramer( [ colA, colB, colC, freeCol ] );
	
	if ( abc === undefined )
		return;
	
	var a = abc[0];
	var b = abc[1];
	var c = abc[2];
	
	var d = y1 - a*x1*x1*x1 - b*x1*x1 - c*x1;
	
	return [ d, c, b, a ];
}

//=========================================================================================
