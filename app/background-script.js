var serverURL = "http://localhost:8888/_ah/api/storage/v0.01/";
var targets = [ "test/" ];

function registerCallback(registrationId) {
  if (chrome.runtime.lastError) {
    // When the registration fails, handle the error and retry the
    // registration later.
    console.log("Registration failed");
    return;
  }
  else {
    chrome.storage.local.set({ registrationId: registrationId });

    // Send the registration token to your application server.
    registerTargets(registrationId, targets, function(succeed) {
      // Once the registration token is received by your server,
      // set the flag such that register will not be invoked
      // next time when the app starts up.
    });
  }
}

function registerTargets(registrationId, targets, callback) {
  // Send the registration token to your application server
  // in a secure way.
  console.log("Call storage-server with: " + registrationId + " - targets: " + targets);

  var targetParam = "".concat.apply("", targets.map(function(t) {
    return "&targets=" + encodeURIComponent(t);
  }));

  fetch(serverURL + "registerGCMTargetList?gcmClientId=" + registrationId + targetParam, {
    mode: "no-cors"
  }).then(function(response) {
    console.log(response);

    callback();
  });
}

chrome.gcm.onMessage.addListener(function(message) {
  // A message is an object with a data property that
  // consists of key-value pairs.
  console.log(message);
});

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.storage.local.get("registrationId", function(result) {
    // If already registered, bail out.
//    if (result.registrationId) {
//      console.log("Already registered: " + result.registrationId);
//
//      // Send the registration token to your application server.
//      registerTargets(result.registrationId, targets, function(succeed) {
//        // Once the registration token is received by your server,
//        // set the flag such that register will not be invoked
//        // next time when the app starts up.
//      });
//
//      return;
//    }

    // Up to 100 senders are allowed.
    var gcmTestProjectId = "642011540044";
    
    var senderIds = [ gcmTestProjectId ];

    chrome.gcm.register(senderIds, registerCallback);
  });
});
