function startApp() {
   

    sessionStorage.clear();

    showHideMenuLinks();

    showView('viewHome');

    //Bind the navigation links
    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkListAds').click(listAds);
    $('#linkCreateAd').click(showCreateAdView);
    $('#linkLogout').click(logoutUser);
    //
    // //Bind the submit buttons
     $('#buttonLoginUser').click(loginUser);
     $('#buttonRegisterUser').click(registerUser);
     $('#buttonCreateAd').click(createAdd);
     $('#buttonEditAd').click(editAdd);

    //Bind msg boxes to hide on click
    $('#infoBox,#errorBox').click(function(){
        $(this).fadeOut();
    });

    //Attach AJAX loading event listener
    $(document).on({
        ajaxStart:function(){$('#loadingBox').show()},
        ajaxStop:function(){$('#loadingBox').hide()}
    });


}