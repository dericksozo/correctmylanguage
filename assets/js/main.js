
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

    autosize($(".js-correctform-textarea"));

    // TODO: Add a check to the form to see if there is at least one character in there and don't show the form unelss there is.


    // Submitting the form.
    $(".js-correct-form").submit(function (e) {
        e.preventDefault();
        var $submitButton = $(".js-correctform-submitbutton");

        $submitButton.attr("data-state", "submitting");
        $submitButton.attr("disabled", "disabled");
        $submitButton.attr("value", "提出中...");
    });


}());