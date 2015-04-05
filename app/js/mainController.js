'use strict';
angular.module('deiCodebreak')
.controller('MainController', ['$scope', '$rootScope', function ($scope, $rootScope)
{

	window.sc = $scope;

	//=============================================================================================================

	$scope.currentView = 'home';

	$scope.isEncodeMode = true;

	$scope.toggleEncodeMode = function ()
	{
		$scope.isEncodeMode = ! $scope.isEncodeMode;
	};

	$scope.setEncodeMode = function ( isEncodeMode )
	{
		$scope.isEncodeMode = isEncodeMode;
	};

	//=============================================================================================================

	$scope.closePopups = function ()
	{
		$scope.$broadcast( 'CLOSE_POPUPS' );
	};

	$scope.reset = function ()
	{
		$scope.closePopups();

//		$scope.currentView = 'home';
//		$scope.isEncodeMode = true;

		$scope.$broadcast( 'RESET' );
	};

	$scope.resetEncodeMode = function ()
	{
		$scope.isEncodeMode = true;
	};

//=============================================================================================================

	$scope.changeView = function ( view )
    {
		$scope.currentView = view;
		$scope.reset();
    };

// =============================================================================================================

    $scope.$on('amplify_logout_selected', function(){

        $scope.loggedIn = false;
        $scope.logout();
    });

    $rootScope.$on('amp-access-login-event', function (event, isNew, param)
    {
        $scope.loggedIn = true;
        if (isNew)
        {
            // NOTE: THIS IS WHERE YOU NEED TO INITIALIZE THE AMP EVENTS. (param.unique_id)
            console.log('success login: unique_id= ' + param.unique_id);
        }
    });

//=============================================================================================================

	$scope.aboutPage =
	{
		isActive: false
	};

//=============================================================================================================

	$scope.levelMenu =
	{
		isActive: false,
		isSimPauseToggled: false
	};

//=============================================================================================================

	$scope.binaryKeyboard =
	{
		isActive: false,
		inputChars: '',
		bitsNumber: 5
	};

//=============================================================================================================
}]);
