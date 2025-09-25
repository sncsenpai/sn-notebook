function(scope, elm) {
  // Put into the link function
  var checkPageReady = window.setInterval(function() {
    var ticketHeader = $("span[ng-if='!data.agent && data.agentPossible']");
    if (ticketHeader)
      window.clearInterval(checkPageReady);
    ticketHeader.text(scope.c.data.taskMessage);
  });
}
