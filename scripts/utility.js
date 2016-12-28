function handleAjaxError(event,response){
    let errorMsg = JSON.stringify(response);
    
    if (response.readyState === 0) {
        errorMsg = "Cannot connect due to network error.";
    }
    if (response.responseJSON && response.responseJSON.description) {
        errorMsg = response.responseJSON.description;
    }
    showError(errorMsg);
}
function showError(errorMsg){
    $('#errorBox').text("Error: "+errorMsg);
    $('#errorBox').show();
    $("html, body").animate({ scrollTop: 0 }, "fast");
}
function showInfo(info){
    $('#infoBox').text(info);
    $('#infoBox').show();
    setTimeout(function(){$('#infoBox').fadeOut()},3000)
}
function textCutter(text,maxLength){
    if(text.length>maxLength){
        return text.substr(0,maxLength)+'...';
    }
    return text;
}
function validateData(title,description,publisher,price){
    if(title.length==0 || typeof title!='string'){
        showError('Incorrect title.');
        return false;
    }
    if(description.length==0 || typeof description!='string'){
        showError('Incorrect description.');
        return false;
    }
    if(publisher.length==0 || typeof publisher!='string'){
        showError('Incorrect publisher.');
        return false;
    }
    if(price.length==0 || typeof Number(price)!='number'){
        showError('Incorrect price.');
        return false;
    }
    return true;
}
function validateUser(username,password,email){
    let validatorRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(username.length==0){
        showError('Incorrect username!');
        return false;
    }
    if(password.length==0){
        showError('Incorrect password!');
        return false;
    }
    if(!validatorRegex.test(email)){
        showError('Incorrect email!');
        return false;
    }
    return true;
}
function formatDate(dateISO8601) {
    let date = new Date(dateISO8601);
    if (Number.isNaN(date.getDate()))
        return '';
    return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
        "." + date.getFullYear() + ' ' + date.getHours() + ':' +
        padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

    function padZeros(num) {
        return ('0' + num).slice(-2);
    }
}
function sortByDate(date1,date2){
    date1=new Date(date1);
    date2=new Date(date2);
    
    return date1.getTime()-date2.getTime();
}
