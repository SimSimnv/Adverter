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
function validateData(title,description,publisher,date,price){
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
    if(date.length==0 || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)){
        showError('Incorrect date.');
        return false;
    }
    if(price.length==0 || typeof Number(price)!='number'){
        showError('Incorrect price.');
        return false;
    }
    return true;
}

