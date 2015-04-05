//=============================================================================================================
// #fps

FPSFramesPerUpdate = 60;

//=============================================================================================================

FPS = 0;
FPSFramesNumber = 0;
FPSLastTime = 0;

//=============================================================================================================

FPSPos = vec0;

FPSFontColor = '#FFFF00';
FPSBackgroundColor = '#0000FF';

FPSPadding = 4;
FPSFontSize = 24;

FPSPrefix = 'FPS: ';

//=============================================================================================================

function setFPSFont ()
{
	ctx.font = FPSFontSize + 'px Arial';
}

//=============================================================================================================

FPSWidth = 0;

function initFPS ( pos )
{
	ctx.save();

	setFPSFont();

	FPSWidth = ctx.measureText( FPSPrefix + '99' ).width;

	ctx.restore();

	if ( pos !== undefined )
		FPSPos = pos;
	else
		FPSPos = vec( ctx.canvas.width - FPSWidth - FPSPadding*2, FPSPadding*2 );

	// requestAnimationFrame( FPS_requestAnimationFrameUpdate );
}

//=============================================================================================================

//function FPS_requestAnimationFrameUpdate ( msTimeDelta )
//{
//
//	FPSFramesNumber += 1;
//	if ( FPSFramesNumber > FPSFramesPerUpdate )
//	{
//		var realTime = ((new Date()).getTime()) / 1000;
//		FPS = FPSFramesNumber / ( realTime - FPSLastTime );
//
//		FPSFramesNumber = 0;
//		FPSLastTime = realTime;
//	}
//
//	requestAnimationFrame( FPS_requestAnimationFrameUpdate );
//}

//=============================================================================================================

function updateFPS ()
{
	// return;

	FPSFramesNumber += 1;
	if ( FPSFramesNumber > FPSFramesPerUpdate )
	{
		var realTime = getRealTime();
		FPS = FPSFramesNumber / ( realTime - FPSLastTime );

		FPSFramesNumber = 0;
		FPSLastTime = realTime;
	}
}

//=============================================================================================================

function renderFPS ()
{
	ctx.save();

	var text = FPSPrefix + roundToInt( FPS );

	setFPSFont();

	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';

	ctx.fillStyle = FPSBackgroundColor;
	ctx.fillRect( FPSPos.x, FPSPos.y, FPSWidth + FPSPadding*2, FPSFontSize + FPSPadding*2 );

	ctx.fillStyle = FPSFontColor;
	ctx.fillText( text, FPSPos.x + FPSPadding, FPSPos.y + FPSPadding + FPSFontSize/2 );

	ctx.restore();
}

//=============================================================================================================
