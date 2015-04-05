'use strict';

var app = angular.module('deiCodebreak');

app.directive('homeView', function () {
	return {
		restrict: 'E',
		scope: true,
		replace: true,
		templateUrl: 'views/home/home.html',

		controller: [ '$scope', '$rootScope', function ( $scope, $rootScope )
		{
            var enteredText,
                rowsText,
                transitionsNumber,
                allTransitions = [],
                endLine = '\n',
                resultTexString = '',
                maxTransitionPlaces = 0,
                currentX = 0;

            function getPictureHeight () {
                return maxTransitionPlaces * elements_yDistance + picture_bottomPadding;
            }

            function getStartInputYPosition (transitionHeight) {
                return transitionHeight - inputs_topPadding;
            }

            function getStartOutputYPosition (transitionHeight) {
                return transitionHeight - inputs_topPadding - outputPlaces_topPadding
            }

            function drawInputPlaces (transitionHeight, inputPlaces) {
                var currentY = getStartInputYPosition(transitionHeight);

                _.each(inputPlaces, function (place) {
                    var labelPosition = currentY + label_padding,
                        vectorPosition = currentX + place_radius;

                    resultTexString = resultTexString +
                        '\\put(' + currentX + ',' + labelPosition + '){' +
                        '\\makebox(0,0)[cb]{$' + place + '$}}' + endLine +
                        '\\put(' + currentX + ',' + currentY + '){\\circle{' + place_diameter + '}}' + endLine +
                        '\\put(' + vectorPosition + ',' + currentY + '){\\vector(1,0){' + transition_vectorWidth + '}}' + endLine;

                    currentY = currentY - elements_yDistance;
                });
            }

            function drawTransition (transitionHeight, transitionName) {
                currentX = currentX + elements_xDistance;

                var currentY = transitionHeight;
                resultTexString = resultTexString +
                    '\\put(' + currentX + ',' + currentY + '){' +
                    '\\makebox(0,0)[cb]{$' + transitionName + '$}}' + endLine +
                    '\\put(' + currentX + ',' + (currentY - arrow_padding) + '){\\vector(0,-1){0.27}}' + endLine +
                    '\\put(' + currentX + ',0){\\line(0,1){' + (currentY - arrow_padding) + '}}' + endLine;
            }

            function drawOutputPlaces (transitionHeight, outputPlaces, outputAndInputItems, cyclicItems) {
                currentX = currentX + elements_xDistance;
                var currentY = getStartOutputYPosition(transitionHeight);

                outputPlaces.forEach(function (place, index) {
                    var labelPosition = currentY + label_padding,
                        vectorPosition = currentX - elements_xDistance;

                    resultTexString = resultTexString +
                        '\\put(' + currentX + ',' + labelPosition + '){' +
                        '\\makebox(0,0)[cb]{$' + place + '$}}' + endLine +
                        '\\put(' + currentX + ',' + currentY + '){\\circle{' + place_diameter + '}}' + endLine +
                        '\\put(' + vectorPosition + ',' + currentY + '){\\vector(1,0){' + transition_vectorWidth + '}}' + endLine;

                    if ( outputAndInputItems.indexOf(index) > -1 ) {
                        vectorPosition = vectorPosition + transition_vectorWidth + place_diameter;

                        resultTexString = resultTexString +
                            '\\put(' + vectorPosition + ',' + currentY + '){\\vector(1,0){' + transition_vectorWidth + '}}' + endLine;
                    }

                    if ( cyclicItems.indexOf(index) > -1 ) {
                        vectorPosition = vectorPosition + transition_vectorWidth + place_diameter;

                        resultTexString = resultTexString +
                            '\\put(' + vectorPosition + ',' + currentY + '){\\line(1,0){' + 2 + '}}' + endLine +
                            '\\put(' + (vectorPosition+2) + ',' + (currentY - 2) + '){\\line(0,1){' + 2 + '}}' + endLine +
                            '\\put(' + (vectorPosition - transition_vectorWidth - place_diameter - 3) + ',' + (currentY - 2) + '){\\line(1,0){' + (transition_vectorWidth + place_diameter + 2 + 3) + '}}' + endLine +
                            '\\put(' + (vectorPosition - transition_vectorWidth - place_diameter - 3) + ',' + (currentY - 2) + '){\\line(0,1){' + 2 + '}}' + endLine +
                            '\\put(' + (vectorPosition - transition_vectorWidth - place_diameter - 3) + ',' + currentY + '){\\vector(1,0){' + 3 + '}}' + endLine;
                    }

                    currentY = currentY - elements_yDistance;
                });
            }

            function convertTransitionToTex (transitionIndex) {
                var transition = parsedTransitionInformation[transitionIndex],
                    inputPlaces = transition.inputPlaces,
                    outputPlaces = transition.outputPlaces,
                    transitionName = transition.transitionName,
                    outputAndInputItems = [],
                    cyclicItems = [];

                outputPlaces.forEach(function (place, outputIndex) {
                    var inputIndex = inputPlaces.indexOf(place);

                    if ( inputIndex > -1 ) {
                        inputPlaces.splice( inputIndex, 1 );
                        cyclicItems.push( outputIndex );
                    }
                });

                var placesCount = inputPlaces.length > outputPlaces.length ? inputPlaces.length : outputPlaces.length;
                var transitionHeight = placesCount * elements_yDistance + picture_bottomPadding;

                if ( transitionIndex + 1 < parsedTransitionInformation.length ) {
                    var nextInputPlaces = parsedTransitionInformation[transitionIndex + 1].inputPlaces;

                    outputPlaces.forEach(function (place, outputIndex) {
                        var nextInputIndex = nextInputPlaces.indexOf(place);

                        if (nextInputIndex > -1) {
                            nextInputPlaces.splice(nextInputIndex, 1);
                            outputAndInputItems.push(outputIndex);
                        }
                    });
                }

                drawInputPlaces(transitionHeight, inputPlaces);

                drawTransition(transitionHeight, transitionName);

                drawOutputPlaces(transitionHeight, outputPlaces, outputAndInputItems, cyclicItems);

                return placesCount;
            }



            function getTransitionsFromString ( transitionStrings )
            {
                var transitions = [];

                var transitionsDataArray = transitionStrings.split('.');
                _.each( transitionsDataArray, function ( transitionString )
                {
                    if ( transitionString.length )
                    {
                        var transitionInformation = transitionString.split(':'),
                            transitionName = transitionInformation[0].trim(),
                            transitionPlaces = transitionInformation[1].split(/->/),
                            inputPlaces = transitionPlaces[0].trim().split(' '),
                            outputPlaces = transitionPlaces[1].trim().split(' ');

                        transitions.push({
                            inputPlaces: inputPlaces,
                            outputPlaces: outputPlaces,
                            transitionName: transitionName //TODO; add to relative position
                        });
                    }
                });

                return transitions;
            }

            $scope.convertToTex = function ()
            {
                var resultTexString = '';
                var transitionStrings = $('.GNText').val();
                var rowsText = $('.GNRows').val();

                var transitions = getTransitionsFromString ( transitionStrings );
                var rows = rowsText.split(';');
                var pictureWidth = rows.length * transition_width;

                for( var index = 0; index < transitions.length; index = index + 1 ) {
                    var placesNumber = convertTransitionToTex(index);

                    if ( placesNumber > maxTransitionPlaces ) {
                        maxTransitionPlaces = placesNumber;
                    }
                }

                var pictureHeight = getPictureHeight();

                resultTexString = '\\begin{picture}(' + pictureWidth + ',' + pictureHeight + ')' + endLine +
                                  resultTexString +
                                  '\\end{picture}';


                console.log(resultTexString);
            }
        }],

		link: function ( scope, element, attrs )
		{
		}
	};
});
