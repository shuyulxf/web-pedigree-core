angular.module('kityminderEditor')
	.directive('templateList', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/templateList/templateList.html',
			scope: {
				minder: '='
			},
            replace: true,
			link: function($scope) {
				$scope.templateList = {
					structure: kityminder.Minder.getTemplateList().structure
				};
				minder.execCommand('template', 'structure');
			}
		}
	});