const kinveyBaseUrl='https://baas.kinvey.com/';
const kinveyAppKey='kid_B1Oj5ufSg';
const kinveyAppSecret='d067a57d94cf4e5b9368226109d5a35f';
const kinveyAppAuthHeaders={'Authorization':'Basic '+btoa(kinveyAppKey+':'+kinveyAppSecret)};

function registerUser(ev){
    ev.preventDefault();
    let username=$('#viewRegister input[name=username]').val();
    let password=$('#viewRegister input[name=passwd]').val();
    let email=$('#viewRegister input[name=email]').val();
    
    if(validateUser(username,password,email)){
        let fullname=$('#viewRegister input[name=fullName]').val();
        
        let userData={username, password, email,fullname};
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
            $(location).attr('href',`#/ads`);
            showInfo('User registration successful.')
        }
    }
}
function loginUser(ev){
    ev.preventDefault();
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
    $.ajax(postRequest).then(loginSuccess);
    function loginSuccess(userInfo){
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        $(location).attr('href',`#/ads`);
        showInfo('Login successful.');
    }
}
function logoutUser(){
    let url=kinveyBaseUrl+'user/'+kinveyAppKey+'/_logout';
    let logoutRequest={
        method:"POST",
        url,
        headers:getKinveyAuthHeaders()
    };
    $.ajax(logoutRequest)
        .then(logoutSuccess);
    function logoutSuccess(){
        sessionStorage.clear();
        $('#loggedInUser').text('').hide();
        showHideMenuLinks();
        $(location).attr('href',`#/home`);
        showInfo('Logout successful.');
    }
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