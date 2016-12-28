function startApp() {
   

    sessionStorage.clear();

    showHideMenuLinks();

    showView('viewHome');
    

    // //Bind the submit buttons
     $('#buttonLoginUser').click(loginUser);
     $('#buttonRegisterUser').click(registerUser);
     $('#buttonCreateAd').click(createAdd);
     $('#buttonEditAd').click(editAdd);
     $('#buttonDeleteAd').click(deleteAdd);

    //Default actions
    $('#infoBox,#errorBox').click(function(){
        $(this).fadeOut();
    });
    $(document).on({
        ajaxStart:function(){$('#loadingBox').show()},
        ajaxStop:function(){$('#loadingBox').hide()}
    });
    $(document).ajaxError(handleAjaxError);
    $('#loggedInUser').on('click',function(){$(location).attr('href',`#/user/${sessionStorage.getItem('userId')}`);});

    let sammyApp=Sammy('main',function(){
        this.get('#/',function(){
            this.redirect('#/home');
        });
        this.get('#/home',function(){
            showHomeView()
        });
        this.get('#/login',function(){
            if(sessionStorage.getItem('userId')){
                this.redirect('#/home');
            }
            else{
                showLoginView();
            }
        });
        this.get('#/register',function(){
            if(sessionStorage.getItem('userId')){
                this.redirect('#/home');
            }
            else{
                showRegisterView();
            }
        });

        this.get('#/ads',function(){
            if(sessionStorage.getItem('userId')){
                listAds()
            }
            else{
                this.redirect('#/home');
            }
        });

        this.get('#/ads/:id',function(){
            if(sessionStorage.getItem('userId')){
                if(this.params.showRev)
                    getDetailsAdd(this.params.id,true);
                else
                    getDetailsAdd(this.params.id);
            }
            else{
                this.redirect('#/home');
            }
        });

        this.get('#/ads/edit/:id',function(){
            if(sessionStorage.getItem('userId')){
                loadAddForEdit(this.params.id);
            }
            else{
                this.redirect('#/home');
            }
        });

        this.get('#/ads/delete/:id',function(){
            if(sessionStorage.getItem('userId')){
                loadAddForDelete(this.params.id);
            }
            else{
                this.redirect('#/home');
            }
        });

        this.get('#/createAd',function(){
            if(sessionStorage.getItem('userId')){
                showCreateAdView()
            }
            else{
                this.redirect('#/home');
            }
            
        });
        this.get('#/logout',function(){
            if(sessionStorage.getItem('userId')){
                logoutUser();
            }
            else{
                this.redirect('#/home');
            }
            
        });
        this.get('#/user/:id',function(){
            if(sessionStorage.getItem('userId')){
                getUserDetails(this.params.id);
            }
            else{
                this.redirect('#/home');
            }
        });

    });
    
    $(function(){
        sammyApp.run('#/');
    })


}