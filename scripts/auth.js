const kinveyBaseUrl='https://baas.kinvey.com/';
const kinveyAppKey='kid_BJp9nsvr';
const kinveyAppSecret='4a62943b30954e60a7a5b1994b36cb2c';
const kinveyAppAuthHeaders={'Authorization':'Basic '+btoa(kinveyAppKey+':'+kinveyAppSecret)};

function registerUser(){
    let userData={
        username:$('#viewRegister input[name=username]').val(),
        password:$('#viewRegister input[name=passwd]').val()
    };
    let url=kinveyBaseUrl+'user/'+kinveyAppKey+'/';
    let postRequest={
        method:"POST",
        url,
        data:userData,
        headers:kinveyAppAuthHeaders,
        success:registerSuccess
    };
    $.ajax(postRequest);
    function registerSuccess(userInfo){
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        listAds();
        showInfo('User registration successful.')
    }
}
function loginUser(){
    let userData={
        username:$('#formLogin input[name=username]').val(),
        password:$('#formLogin input[name=passwd]').val()
    };
    let url=kinveyBaseUrl+'user/'+kinveyAppKey+'/login';
    let postRequest={
        method:"POST",
        url,
        data:userData,
        headers:kinveyAppAuthHeaders
    };
    $.ajax(postRequest).then(loginSuccess)
    function loginSuccess(userInfo){
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        listAds();
        showInfo('Login successful.')
    }
}
function logoutUser(){
    //TODO: invoke kinvey REST logout
    sessionStorage.clear();
    $('#loggedInUser').text('').hide();
    showHideMenuLinks();
    showView('viewHome');
    showInfo('Logout successful.');
}

function saveAuthInSession(userInfo){
    sessionStorage.setItem('userId',userInfo._id);
    sessionStorage.setItem('username',userInfo.username);
    sessionStorage.setItem('authToken',userInfo._kmd.authtoken);
    $('#loggedInUser').text('Welcome, '+userInfo.username+'!').show();
}
function getKinveyAuthHeaders() {
    return {
        'Authorization':'Kinvey '+sessionStorage.getItem('authToken')
    };
}