var app = angular.module('myapp', []);
app.controller('Main',['$scope', '$sce', function ($scope, $sce) {
  // pip, half
  $scope.layout_type = "layout-half"
  $scope.layout_options = [{ name: "Side-by-side", id: "layout-half" }, { name: "PiP", id: "layout-pip" }];
  $scope.layout_lookup = { "layout-half": "Side-by-side", "layout-pip": "PiP" };
  $scope.streamers = [{ name: 'diabetech', show_bar: true }, { name: 'REXmoreOP', show_bar: true }];
  // $scope.getUrl = function(username) {
  //   return $sce.trustAsResourceUrl('http://www.twitch.tv/' + username + '/embed');
  // };
  $scope.toggleFullScreen = function() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
      // toggleFullPlayerHoverListeners();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      // toggleStandardPlayerHoverListeners();
    }
  };
  $scope.getStreamClasses = function(streamer, index) {
    var klasses = [];
    klasses.push('streamer-' + index);
    klasses.push(streamer.show_bar ? 'show-bar' : 'hide-bar');
    return klasses.join(' ');
  };
  $scope.toggleTwitchBar = function(streamer) {
    streamer.show_bar = !streamer.show_bar;
  };
  $scope.swapStreamers = function() {
    var temp = $scope.streamers[0].name;
    $scope.streamers[0].name = $scope.streamers[1].name;
    $scope.streamers[1].name = temp;
    $scope.loadStream('stream-video-0', $scope.streamers[0].name);
    $scope.loadStream('stream-video-1', $scope.streamers[1].name);
  };
  $scope.loadStream = function(id, channel) {
    jQuery(function () {
      window.onPlayerEvent = function (data) {
        data.forEach(function(event) {
          if (event.event == "playerInit") {
            var player = jQuery('#' + id)[0];
            player.playVideo();
            player.mute();
          }
        });
      }
      swfobject.embedSWF("http://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf"
      , id, "640", "400", "11", null
      , { "eventsCallback": "onPlayerEvent", "embed": 1, "channel": channel, "auto_play":"true" }
      , { "allowScriptAccess":"always", "allowFullScreen":"true"});
    });
  };
}]);
app.directive('daStream', function () {
  return {
    replace: false,
    transclude: false,
    restrict: 'A',
    scope: false,
    link: function ($scope, element, attrs) {
      // element.resizable({
      //   aspectRatio: 16 / 9
      // });
      element.draggable({
        stack: '.streamers .stream'
        , handle: '.drag-handle'
        // , snap: true
      });
    }
  };
});
app.directive('daVideo', function () {
  return {
    replace: false,
    transclude: false,
    restrict: 'A',
    scope: false,
    link: function ($scope, element, attrs) {
      $scope.loadStream(attrs.id, attrs.channel)
    }
  };
});

