var c = angular.module('appControllers',['ngMaterial','ngMessages','appServices']);

c.controller('ubbCardController',['$scope','$mdToast',function($scope,$mdToast){
	$scope.copyUbbCode = function(){
		window.getSelection().removeAllRanges();
		var node = document.querySelector("#ubbcode");
		node.select();
		var result = document.execCommand('copy');
		var msg = "UBB Code kon niet worden gekopieerd.";
		if(result){
				msg = "UBB code succesvol naar klembord gekopieerd.";	
		};
		
		$mdToast.show($mdToast.simple().content(msg));
		window.getSelection().removeAllRanges();
		
	};
}]);

c.controller('movieCardController',['$scope','reviewService',function($scope,reviewService){
		
	$scope.generateUbb = function(){
		
		if(reviewService.reviews.length == 0){
			$scope.ubbcode = reviewService.generateUbbFromEntry({
				Title: $scope.movie.Title,
				reviewScore: $scope.reviewscore,
				reviewText: $scope.reviewtext,
				movie: $scope.movie
			});
			$scope.ubbGenerated= true;
		}else{
			
			reviewService.addReview({
				Title: $scope.movie.Title,
				reviewScore: $scope.reviewscore,
				reviewText: $scope.reviewtext,
				movie: $scope.movie
			});
			
			$scope.ubbcode = reviewService.generateUbbCode();
			$scope.ubbGenerated=true;
		}
	}
		
	$scope.saveAndReset = function(){
		
		reviewService.addReview({
			Title: $scope.movie.Title,
			reviewScore: $scope.reviewscore,
			reviewText: $scope.reviewtext,
			movie: $scope.movie
		});
		
		delete $scope.movie;
		delete $scope.reviewtext;
		delete $scope.reviewscore;
		delete $scope.selectedMovie;	
		delete $scope.searchText;
	}
	
	$scope.$watch('reviewtext',function(n,o){
		$scope.showubbbutton = false;
		if(n != null && n != ""){
			
			if(reviewService.hasReview($scope.movie.imdbID)){
				reviewService.getReview($scope.movie.imdbID).reviewText = n;
			}
			
			$scope.showubbbutton = true;
		}
	});

	$scope.$watch('reviewscore',function(n,o){
		if(n!=o && n!=null && reviewService.hasReview($scope.movie.imdbID)){
			reviewService.getReview($scope.movie.imdbID).reviewScore = n;
		}
	});
	
}]);

c.controller('reviewListController',['$scope','reviewService',function($scope,reviewService){
	
	$scope.reviews = reviewService.reviews;
	
	$scope.removeFromList = function(review){
		reviewService.removeReview(review);
	}
	
	$scope.openReview = function(review){
		$scope.reviewtext = review.reviewText;
		$scope.reviewscore = review.reviewScore;
		$scope.movie = review.movie;
		$scope.ubbGenerated = false;
	};
	
	$scope.generateUbbFromList = function(){
		$scope.ubbcode= reviewService.generateUbbCode();
		$scope.ubbGenerated=true;
	}
	
}]);

c.controller('AppCtrl',['$scope','movieService',function($scope,movieService){
		
	$scope.copyaction = false;
	
	$scope.getMovies = function(text){
		$scope.showLoading=true
		
		text = text.replace(" ","+");
		return movieService.getMovies(text).then(function(data){
			$scope.showLoading = false;
			return data;
		},function(response){
			$scope.showLoading=false;
			console.error('response failed');
			console.error(response);
		});
	}
	
	$scope.$watch('selectedMovie',function(n,o){
		
		if(n!=o && n!=null){
			
			$scope.showLoading = false;
			if(n.hasOwnProperty('imdbID')){
				$scope.showLoading= true;
				movieService.getDetails(n.imdbID).then(function(response){
					$scope.movie = response;
					$scope.showLoading = false;
				},function(response){
					$scope.showLoading = false;
				});
			}			
		}
	});
	
	$scope.showMovieData = function(){
		$scope.ubbGenerated = false;
		$scope.ubbcode=null;
	}
	

	
	$scope.showMovieCard = function(){
		if($scope.hasOwnProperty('movie')){
			return !$scope.ubbGenerated;
		}
		return false;
	}
}]);