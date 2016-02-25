
(function () {

    /* Some kind of CSS fix to make up for a bug. */
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
      var msViewportStyle = document.createElement('style')
      msViewportStyle.appendChild(
        document.createTextNode(
          '@-ms-viewport{width:auto!important}'
        )
      )
      document.querySelector('head').appendChild(msViewportStyle)
    }

    var myFirebaseRef = new Firebase("https://correctmylanguage.firebaseio.com/");
    var corrections = myFirebaseRef.child("corrections");

    myFirebaseRef.authAnonymously(function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });

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
        myFirebaseRef.set({
            title: "Hello World!",
            author: "Firebase",
            location: {
                city: "San Francisco",
                state: "California",
                zip: 94103
            }
        }, function (error) {
            if (error) {
                console.log("What was the error?", error);
            } else {
                $submitButton.removeAttr("data-state");
                $submitButton.removeAttr("disabled");
                $submitButton.attr("value", "提出");
            }
        });

    });


}());