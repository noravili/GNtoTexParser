//=========================================================================================
// #canvas

//=========================================================================================

simTime = 0;

function getRealTime ()
{
	return ((new Date()).getTime()) / 1000;
}

function getRealTimeMs ()
{
	return ((new Date()).getTime());
}

//=========================================================================================

ctx = undefined;

canvasStack = [];

function pushCanvas ( canvas )
{
	canvasStack.push( ctx );
	ctx = canvas.getContext('2d');
}

function popCanvas ()
{
	ctx = canvasStack.pop();
}

function getCanvasSizeVec ()
{
	return getSizeVec( ctx.canvas );
}

//=========================================================================================

function makeCanvas( width, height )
{
    var canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function makeSquareCanvas ( size )
{
	return makeCanvas( size, size );
}

//=========================================================================================

function getCanvasFromImage ( image,
							  clipX /*= 0 */, clipY /*= 0 */, clipWidth /*= image.width */, clipHeight /*= image.height */,
							  canvasWidth /*= clipWidth */, canvasHeight /*= clipHeight */ )
{
	if ( clipX === undefined )
	{
		clipX = 0;
		clipY = 0;
		clipWidth = image.width;
		clipHeight = image.height;

		if ( canvasWidth === undefined )
		{
			canvasWidth = clipWidth;
			canvasHeight = clipHeight;
		}
	}

	var canvas = makeCanvas( canvasWidth, canvasHeight );
	pushCanvas( canvas );
	ctx.drawImage( image, clipX, clipY, clipWidth, clipHeight, 0, 0, canvasWidth, canvasHeight );
	popCanvas();
	return canvas;
}

function getRGBA ( canvas, x, y )
{
	var res = 'rgba(';
	pushCanvas( canvas );
	var data = ctx.getImageData( x, y, 1, 1 ).data;
	console.log( 'DATA: ', data );
	res += data[0];
	res += ',';
	res += data[1];
	res += ',';
	res += data[2];
	res += ',';
	res += (data[3] / 255).toFixed(2);
	res += ')';
	popCanvas();
	return res;
}

//=========================================================================================

function drawRect_begEnd ( beg, end )
{
	ctx.rect( beg.x, beg.y, end.x, end.y );
}

//=========================================================================================

function canvasMoveTo ( pos )
{
	ctx.moveTo( pos.x, pos.y );
}

function canvasLineTo ( pos )
{
	ctx.lineTo( pos.x, pos.y );
}

//=========================================================================================

function strokeLine ( x1, y1, x2, y2, color )
{
	if ( color !== undefined )
	{
		ctx.save();
		ctx.strokeStyle = color;
	}

	ctx.beginPath();
	ctx.moveTo( x1, y1 );
	ctx.lineTo( x2, y2 );
	ctx.stroke();

	if ( color !== undefined )
		ctx.restore();
}

function strokeDashLine ( x1, y1, x2, y2, dashSegments, color )
{
    ctx.setLineDash( dashSegments );
    strokeLine( x1, y1, x2, y2, color );
}

function stopDashLine ()
{
    ctx.setLineDash( [] );
}

function strokeLine_begEnd ( beg, end, color )
{
	strokeLine( beg.x, beg.y, end.x, end.y, color );
}

function strokeLine_begSpan ( beg, span, color )
{
	strokeLine_begEnd( beg, vecAdd( beg, span ), color );
}

function strokeHorizontalLine_width ( x, y, width, color )
{
	strokeLine( x, y, x + width, y, color );
}

function strokeHorizontalLine_pos ( beg, spanX, color )
{
	strokeLine_begEnd( beg, vecAddX( beg, spanX ), color );
}

function strokeVerticalLine_height ( x, y, height, color )
{
	strokeLine( x, y, x, y + height, color );
}

function drawPolyLine ( posArr )
{
	canvasMoveTo( posArr[ 0 ] );

	for ( var i = 1; i < posArr.length; i += 1 )
		canvasLineTo( posArr[ i ] );
}

//=========================================================================================

function fillRect_wh ( x, y, width, height, color )
{
	if ( color !== undefined )
	{
		ctx.save();
		ctx.fillStyle = color;
	}

	ctx.beginPath();
	ctx.rect( x, y, width, height );
	ctx.fill();

	if ( color !== undefined )
		ctx.restore();
}

function fillRect ( x1, y1, x2, y2, color /*= ctx.fillStyle */ )
{
	fillRect_wh( x1, y1, x2 - x1, y2 - y1, color );
}

function fillRect_begEnd ( beg, end, color )
{
	fillRect( beg.x, beg.y, end.x, end.y, color );
}

function fillRect_begSpan ( beg, span, color )
{
	fillRect_wh( beg.x, beg.y, span.x, span.y, color );
}

//=========================================================================================

function clipRect_wh ( x, y, width, height )
{
	ctx.beginPath();
	ctx.rect( x, y, width, height );
	ctx.clip();
}

//=========================================================================================

function makeLinearGradient ( x1, y1, x2, y2, color1, color2 )
{
	var gradient = ctx.createLinearGradient( x1, y1, x2, y2 );
	gradient.addColorStop( 0, color1 );
	gradient.addColorStop( 1, color2 );
	return gradient;
}

function makeRadialGradient ( x, y, r, color1, color2 )
{
	var gradient = ctx.createRadialGradient( x, y, 0, x, y, r );
	gradient.addColorStop( 0, color1 );
	gradient.addColorStop( 1, color2 );
	return gradient;
}

function strokeGradientLine ( x1, y1, x2, y2, color1, color2 )
{
	var gradient = makeLinearGradient( x1, y1, x2, y2, color1, color2);

	ctx.save();
	ctx.strokeStyle = gradient;
	strokeLine( x1, y1, x2, y2 );
	ctx.restore();
}

function strokeGradientLine_begEnd ( beg, end, color1, color2 )
{
	strokeGradientLine( beg.x, beg.y, end.x, end.y, color1, color2 );
}

function strokeGradientLine_begSpan ( beg, span, color1, color2 )
{
	strokeGradientLine_begEnd( beg, vecAdd( beg, span ), color1, color2 );
}

//=========================================================================================

function drawCircle ( x, y, r )
{
	ctx.arc( x, y, r, 0, PI + PI );
}

function drawCircle_pos ( pos, r )
{
	drawCircle( pos.x, pos.y, r );
}

function fillCircle ( x, y, r, color )
{
	if ( color !== undefined )
	{
		ctx.save();
		ctx.fillStyle = color;
	}

	ctx.beginPath();
	drawCircle( x, y, r );
	ctx.fill();

	if ( color !== undefined )
		ctx.restore();
}

function fillCircle_pos ( pos, r, color )
{
	fillCircle( pos.x, pos.y, r, color );
}
function fillGradientCircle ( x, y, r, color1, color2 )
{
	var gradient = makeRadialGradient( x, y, r, color1, color2 );

	ctx.save();
	ctx.fillStyle = gradient;
	fillCircle( x, y, r, gradient );
	ctx.restore();
}

function fillGradientCircle_pos ( pos, r, color1, color2 )
{
	fillGradientCircle ( pos.x, pos.y, r, color1, color2 );
}

//=========================================================================================

function clearRect_begEnd ( beg, end )
{
	ctx.clearRect( beg.x, beg.y, end.x, end.y );
}

function clearCanvas ()
{
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
}

function clearCanvasTo ( color )
{
	clearCanvas();
	fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height, color );
}

//=========================================================================================

function canvasDrawImage ( img, pos )
{
	ctx.drawImage( img, pos.x, pos.y );
}

function canvasDrawCenteredImage ( img, x, y )
{
	ctx.drawImage( img, x - img.width/2, y - img.height/2 );
	// ctx.drawImage( img, x - 6, y - 6 );
}

function canvasDrawRoundCenteredImage ( img, x, y )
{
	ctx.drawImage( img, round(x - img.width/2), round(y - img.height/2) );
	// ctx.drawImage( img, round(x - 6), round(y - 6) );
}

function canvasDrawCenteredImage_pos ( img, pos )
{
	canvasDrawCenteredImage( img, pos.x, pos.y );
}

function canvasDrawRoundCenteredImage_pos ( img, x, y )
{
	ctx.drawImage( img, round(x - img.width/2), round(y - img.height/2) );
}

function canvasDrawRoundCenteredImage_pos ( img, pos )
{
	canvasDrawRoundCenteredImage( img, pos.x, pos.y );
}

//=========================================================================================

function setFlipXTransformToCanvas ()
{
	ctx.translate( ctx.canvas.width, 0 );
	ctx.scale( -1, 1 );
}

function getFlipXCanvas ( canvas )
{
	var destCanvas = makeCanvas( canvas.width, canvas.height );
	pushCanvas( destCanvas );
	ctx.save();
	setFlipXTransformToCanvas();
	ctx.drawImage( canvas, 0, 0 );
	ctx.restore();
	popCanvas();
	return destCanvas;
}

//=========================================================================================

drawArrowHead_armLen = 10;
drawArrowHead_armAngle = deg(10);

// internal function for drawing an arrow on the end of the line of the vector
function drawArrowHead ( pos, dir, armLen /*= drawArrowHead_armLen */, armAngle /*= drawArrowHead_armAngle */)
{
	armLen = getFirstDefined( armLen, drawArrowHead_armLen );
	armAngle = getFirstDefined( armAngle, drawArrowHead_armAngle );

	var arm = vecScaleTo( dir, armLen );

	var arm1 = vecRotate( arm, PI - armAngle );
	var arm2 = vecRotate( arm, PI + armAngle );

	arm1 = vecAdd( pos, arm1 );
	arm2 = vecAdd( pos, arm2 );

	arm1 = roundToIntVec( arm1 );
	arm2 = roundToIntVec( arm2 );

	canvasLineTo( arm1 );
	canvasLineTo( arm2 );
	canvasLineTo( pos );
}

function drawVec_pos ( beg, end )
{
	canvasMoveTo( beg );
	canvasLineTo( end );

	var dir = vecSpan( beg, end );

	drawArrowHead( end, dir );
}

function drawVec ( x1, y1, x2, y2 )
{
	drawVec_pos( vec(x1,y1), vec(x2,y2) );
}

function drawVec_begSpan ( beg, span )
{
	drawVec_pos( beg, vecAdd( beg, span ) );
}

function strokeVec_pos ( beg, end, color /*= ctx.fillStyle*/ )
{
	ctx.beginPath();
	drawVec_pos( beg, end );
	if ( color !== undefined )
	{
		ctx.save();
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
	}
	ctx.fill();
	ctx.stroke();
	if ( color !== undefined )
		ctx.restore();
}

function strokeVec ( x1, y1, x2, y2, color /*= ctx.fillStyle*/ )
{
	strokeVec_pos( vec(x1,y1), vec(x2,y2), color );
}

//=========================================================================================

function makeColor ( red, green, blue, alpha /*= 1 */ )
{
	alpha = choose( C(alpha) || 1 );

	return {
		red: red,
		green: green,
		blue: blue,
		alpha: alpha
	};
}

function getFracColor ( color1, color2, alpha )
{
	function getPart ( colorName )
	{
		return getFracValue( color1[ colorName ], color2[ colorName ], alpha );
	}

	return {
		red: getPart('red'),
		green: getPart('green'),
		blue: getPart('blue'),
		alpha: getPart('alpha')
	};
}

function getRoundColor ( color )
{
	return {
		red: round( color.red ),
		green: round( color.green ),
		blue: round( color.blue ),
		alpha: color.alpha
	};
}

function getCanvasColor ( color )
{
	color = getRoundColor( color );
	return 'rgba('+ color.red +','+ color.green +','+ color.blue +','+ color.alpha  +')';
}

function getFracCanvasColor ( color1, color2, frac )
{
	return getCanvasColor( getFracColor( color1, color2, frac ) );
}

//=========================================================================================

exampleDrawingBoard =
{
	drawX: 0,
	drawY: 0,
	drawWidth: 0,
	drawHeight: 0,

	plotX: 0,
	plotY: 0,
	plotWidth: 0,
	plotHeight: 0
};

//=========================================================================================

function getDrawingBoard ( drawingBoard, params )
{
	//---------------------------------------------
	// drawingBoard
	var db = drawingBoard;

	var dbDrawX = db.drawX;
	var dbDrawY = db.drawY;
	var dbDrawWidth = db.drawWidth;
	var dbDrawHeight = db.drawHeight;

	var dbPlotX = db.plotX;
	var dbPlotY = db.plotY;
	var dbPlotWidth = db.plotWidth;
	var dbPlotHeight = db.plotHeight;

	var dbDrawXScale = dbDrawWidth / dbPlotWidth;
	var dbDrawYScale = dbDrawHeight / dbPlotHeight;
	//---------------------------------------------

	var plotX = params.plotX;
	var plotY = params.plotY;
	var drawX = params.drawX;
	var drawY = params.drawY;

	if ( plotX !== undefined )
		drawX = dbDrawX + ( plotX - dbPlotX ) * dbDrawXScale;

	if ( plotY !== undefined )
		drawY = dbDrawY + ( plotY - dbPlotY ) * dbDrawYScale;

	if ( drawX !== undefined )
		plotX = dbPlotX + ( drawX - dbDrawX ) / dbDrawXScale;

	if ( drawY !== undefined )
		plotY = dbPlotY + ( drawY - dbDrawY ) / dbDrawYScale;

	return {
		drawX: drawX,
		drawY: drawY,
		plotX: plotX,
		plotY: plotY
	};
}

//=========================================================================================

function getDrawingBoardDrawX ( drawingBoard, plotX )
{
	var drawX = getDrawingBoard( drawingBoard, {plotX:plotX} ).drawX;
	return drawX;
}

//=========================================================================================

function clearDrawingBoard ( drawingBoard )
{
	var db = drawingBoard;
	ctx.clearRect( db.drawX, db.drawY, db.drawWidth, db.drawHeight );
}

//=========================================================================================

function drawDrawingBoardRect ( drawingBoard )
{
	var db = drawingBoard;
	ctx.rect( db.drawX, db.drawY, db.drawWidth, db.drawHeight );
}

//=========================================================================================

function clearDrawingBoardTo ( drawingBoard, color )
{
	ctx.save();
	ctx.beginPath();
	drawDrawingBoardRect( drawingBoard );
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}

//=========================================================================================

function clipDrawingBoard ( drawingBoard )
{
	var db = drawingBoard;
	clipRect_wh( db.drawX, db.drawY, db.drawWidth, db.drawHeight );
}

//=========================================================================================

function drawFuncToDrawingBoard ( drawingBoard, func, drawStep /*= 1 */ )
{
	drawStep = drawStep || 1;

	var ctx = window.ctx;

	//---------------------------------------------
	// drawingBoard
	var db = drawingBoard;

	var dbDrawX = db.drawX;
	var dbDrawY = db.drawY;
	var dbDrawWidth = db.drawWidth;
	var dbDrawHeight = db.drawHeight;

	var dbPlotX = db.plotX;
	var dbPlotY = db.plotY;
	var dbPlotWidth = db.plotWidth;
	var dbPlotHeight = db.plotHeight;

	var dbDrawXScale = dbDrawWidth / dbPlotWidth;
	var dbDrawYScale = dbDrawHeight / dbPlotHeight;
	//---------------------------------------------

	var x0 = dbDrawX;

	var drawX, drawY, plotX, plotY;

	//---------------------------------------------
	// get drawY from drawX
	/*
	plotX = dbPlotX + ( drawX - dbDrawX ) * dbPlotXScale;
	plotY = func( plotX );
	drawY = dbDrawY + ( plotY - dbPlotY ) * dbDrawYScale;
	*/
	//---------------------------------------------

	var y0;
	//---------------------------------------------
	// get drawY from drawX
	plotX = dbPlotX + ( x0 - dbDrawX ) / dbDrawXScale;
	plotY = func( plotX );
	y0 = dbDrawY + ( plotY - dbPlotY ) * dbDrawYScale;
	//---------------------------------------------

	ctx.moveTo( x0, y0 );

	var dbDrawEndX = dbDrawX + dbDrawWidth;

	while ( true )
	{
		var x1 = x0 + drawStep;

		if ( x1 > dbDrawEndX )
			x1 = dbDrawEndX;

		var y1;
		//---------------------------------------------
		// get drawY from drawX
		plotX = dbPlotX + ( x1 - dbDrawX ) / dbDrawXScale;
		plotY = func( plotX );
		y1 = dbDrawY + ( plotY - dbPlotY ) * dbDrawYScale;
		//---------------------------------------------

		var x2 = x1 + drawStep;

		if ( x2 > dbDrawEndX )
			x2 = dbDrawEndX;

		var y2;
		//---------------------------------------------
		// get drawY from drawX
		plotX = dbPlotX + ( x2 - dbDrawX ) / dbDrawXScale;
		plotY = func( plotX );
		y2 = dbDrawY + ( plotY - dbPlotY ) * dbDrawYScale;
		//---------------------------------------------

		var cx = x1*2 - (x0 + x2)/2;
		var cy = y1*2 - (y0 + y2)/2;

		ctx.quadraticCurveTo( cx, cy, x2, y2 );

		if ( x2 === dbDrawEndX )
			break;

		x0 = x2;
		y0 = y2;
	}
}

//=========================================================================================

function getQuadraticCurveControlPoint ( x0, y0, x1, y1, x2, y2 )
{
	var cx = x1*2 - (x0 + x2)/2;
	var cy = y1*2 - (y0 + y2)/2;
	return vec( cx, cy );
}

function getQuadraticCurveControlPoint_pos ( p0, p1, p2 )
{
	return getQuadraticCurveControlPoint( p0.x, p0.y, p1.x, p1.y, p2.x, p2.y );
}

//=========================================================================================

function drawGridToCanvas ( horizontalLineCount, verticalLineCount, color )
{
    var rectangleHeight = ctx.canvas.height / ( horizontalLineCount + 1 ),
        rectangleWidth = ctx.canvas.width / ( verticalLineCount + 1 );

    for ( var i = 1; i <= horizontalLineCount; i++ )
	{
        strokeLine(
            0, rectangleHeight*i,
            ctx.canvas.width, rectangleHeight*i,
            color
        );
    }

    for ( i = 1; i <= verticalLineCount; i++ )
	{
        strokeLine(
            rectangleWidth*i, 0,
            rectangleWidth*i, ctx.canvas.height,
            color
        );
    }
}

//=========================================================================================

function makeCircleCanvas ( radius, color /*= default fillStyle */ )
{
	var canvas = makeSquareCanvas( (ceil( radius ) + 1)*2 );
	pushCanvas( canvas );
	fillCircle( radius + 1, radius + 1, radius, color );
	popCanvas( canvas );
	return canvas;
}

//=========================================================================================

function initCanvas ( canvas )
{
	ctx = canvas.getContext('2d');
}

//=========================================================================================
