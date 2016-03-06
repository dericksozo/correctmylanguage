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

    // Set up autosize on the textarea.
    autosize($(".js-correctform-textarea"));

    // Load all messages for the current video id on page load.
    videoRef.once("value", function(snapshot) {
        var records = snapshot.val(),
            size,
            $corrections = $(".js-corrections");

            var record;

        // Checking if there are no comments.
        if (records === undefined || records === null) {
            size = 0;
        } else {
            size = Object.keys(records).length;
        }

        if (size <= 0) {
            // Render it differently.
            $corrections.attr("data-state", "empty");
        } else {

            for (record in records) {
                if (records.hasOwnProperty(record)) {

                    var source   = $("#correction-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                        message: records[record].correction
                    };
                    $corrections.append(template(context));
                }
            }

            $corrections.attr("data-state", "loaded");
        }

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // TODO: Add a check to the form to see if there is at least one character in there and don't show the form button unelss there is.

    $(".js-correctform-textarea").keyup(function (e) {
        e.preventDefault();

        var value = $(this).val();

        // Only display the submit button if there's at least 1 character in there.
        if (value.length >= 1) {
            $(".js-correctform").attr("data-state", "showCallToAction");
        } else {
            $(".js-correctform").attr("data-state", "empty");
        }
    });

    // Submitting the form.
    $(".js-correctform-form").submit(function (e) {
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
                timestamp: Date.now()
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