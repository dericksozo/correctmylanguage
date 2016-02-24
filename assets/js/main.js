
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

    $(".js-correct-form").submit(function (e) {
        alert("Just submitted the form.");
        e.preventDefault();
    });
}());