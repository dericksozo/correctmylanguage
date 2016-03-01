
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};

  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

(function () {

    var currentURL = window.location.href,
        currentURLSplit = currentURL.split("/");
        videoId = currentURLSplit[currentURLSplit.length - 2];

    var myFirebaseRef = new Firebase("https://correctmylanguage.firebaseio.com/"),
        videoRef = myFirebaseRef.child(videoId);

    // Authenticate the user anonymously
    myFirebaseRef.authAnonymously(function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });

    // Display the messages.
    // Attach an asynchronous callback to read the data at our posts reference
    videoRef.on("value", function(snapshot) {
        var records = snapshot.val(),
            size = Object.keys(records).length,
            $corrections = $(".js-corrections");

            var record,
                dataObject = {};
        if (size <= 0) {
            // Render it differently.
        } else {

            for (record in records) {
                if (records.hasOwnProperty(record)) {
                    /* Can this be made faster using the shadow dom? */;

                    console.log("What's records[record]?", records[record]);

                    dataObject.message = records[record].message;

                    $corrections.append(tmpl("correction_template"), dataObject);
                }
            }

        }

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // Set up autosize on the textarea.
    autosize($(".js-correctform-textarea"));

    // TODO: Add a check to the form to see if there is at least one character in there and don't show the form button unelss there is.
    // Submitting the form.
    $(".js-correct-form").submit(function (e) {
        e.preventDefault();
        var $submitButton = $(".js-correctform-submitbutton");

        $submitButton.attr("data-state", "submitting");
        $submitButton.attr("disabled", "disabled");
        $submitButton.attr("value", "提出中...");

        /* Just testing this out with some test data. */

        var authData = myFirebaseRef.getAuth();

        if (authData) {

            /* Save the correction into firebase. */
            videoRef.push({
                correction: $(".js-correctform-textarea").val(),
                author: authData.uid,
            }, function (error) {
                if (error) {
                    console.log("What was the error?", error);
                } else {

                    // Reset the submit button
                    $submitButton.removeAttr("data-state");
                    $submitButton.removeAttr("disabled");
                    $submitButton.attr("value", "提出");

                    $(".js-correctform-textarea").val("");
                }
            });

        } else {
            // Need  to do something about this one here.
            console.log("User is logged out");
        }

    });

}());