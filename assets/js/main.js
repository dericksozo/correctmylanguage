(function () {

    var currentURL = window.location.href,
        currentURLSplit = currentURL.split("/");
        videoId = currentURLSplit[currentURLSplit.length - 2];

    var myFirebaseRef = new Firebase("https://correctmylanguage.firebaseio.com/"),
        videoRef = myFirebaseRef.child(videoId);

    var AFTER_SUBMITTION = false, // Keeps track of whether the corrections that already exist have been rendered or not.
        AFTER_INITIAL_RENDER = true;

    var $corrections = $(".js-corrections");

    var correctionNumberCount = 1;

    // Authenticate the user anonymously
    myFirebaseRef.authAnonymously(function(error, authData) {
        if (error) {
            // Change the state most likely.
        } else {
            $(".js-authentication").attr("data-state", "authenticated");
        }
    });

    // Set up autosize on the textarea.
    autosize($(".js-correctform-textarea"));

    videoRef.once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);

        if ( ! exists) {
            $corrections.attr("data-state", "empty");
        }
    });

    // Load all messages for the current video id on page load.
    videoRef.on("child_added", function(snapshot) {

        var record = snapshot.val();

        var $correctionsContainer = $(".js-corrections-container");

        if ( ! AFTER_INITIAL_RENDER) {
            $correctionsContainer.empty();
            AFTER_INITIAL_RENDER = true;
        }

        var source   = $("#correction-template").html();
        var template = Handlebars.compile(source);
        var context = {
            message: record.correction,
            number: correctionNumberCount++,
            animated: AFTER_SUBMITTION ? true : false
        };

        $correctionsContainer.prepend(template(context));

        $corrections.attr("data-state", "loaded");

        AFTER_SUBMITTION = false;

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

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

            AFTER_SUBMITTION = true;
            
            /* Save the correction into firebase. */
            videoRef.push({
                correction: $(".js-correctform-textarea").val(),
                author: authData.uid,
                timestamp: Firebase.ServerValue.TIMESTAMP
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