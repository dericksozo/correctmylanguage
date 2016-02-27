
(function () {

    var myFirebaseRef = new Firebase("https://correctmylanguage.firebaseio.com/");
    var corrections = myFirebaseRef.child("corrections");

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

    // TODO: Add a check to the form to see if there is at least one character in there and don't show the form unelss there is.
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
            myFirebaseRef.child("corrections").push({
                correction: $(".js-correctform-textarea").val(),
                author: authData.uid,
            }, function (error) {
                if (error) {
                    console.log("What was the error?", error);
                } else {
                    $submitButton.removeAttr("data-state");
                    $submitButton.removeAttr("disabled");
                    $submitButton.attr("value", "提出");
                }
            });

        } else {
            // Need  to do something about this one here.
            console.log("User is logged out");
        }

    });


}());