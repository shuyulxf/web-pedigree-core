angular.module('kityminderEditor')
	.directive('themeList', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/themeList/themeList.html',
            replace: true,
			link: function($scope) {
				var themeList = kityminder.Minder.getThemeList();
				//$scope.themeList = themeList;

				$scope.getThemeThumbStyle = function (theme) {
					var themeObj = themeList[theme];
                    if (!themeObj) {
                        return;
                    }
					var style = {
						'color': themeObj['root-color'],
						'border-radius': themeObj['root-radius'] / 2
					};

					if (themeObj['root-background']) {
						style['background'] = themeObj['root-background'].toString();
					}

					return style;
				};

				// 维护 theme key 列表以保证列表美观（不按字母顺序排序）
				$scope.themeKeyList = [
					'fresh-red-compat',
					'fresh-soil-compat'
				];

				minder.execCommand('theme', 'fresh-red-compat');
			}
		}
	});