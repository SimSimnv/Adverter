function listAds(){


    let getRequest={
        method:"GET",
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements',
        headers:getKinveyAuthHeaders(),
        success:loadAdsSuccess
    };
    $.ajax(getRequest);

    function loadAdsSuccess(ads){
        showInfo('Advertisements loaded');
        $('#ads').empty();

        if(ads.length==0){
            $('#books').text('No advertisements available');
        }
        else{
            let adsTable=$('<table>');
            let tr=$('<tr>')
                .append($('<th>').text('Title'))
                .append($('<th>').text('Description'))
                .append($('<th>').text('Publisher'))
                .append($('<th>').text('Date Published'))
                .append($('<th>').text('Price'))
                .append($('<th>').text('Actions'));
            adsTable.append(tr);
            for(let ad of ads){
                appendAdRow(ad,adsTable);
            }
            $('#ads').append(adsTable);
        }

        showView('viewAds');
    }
    function appendAdRow(ad,adsTable){
        let links=[];

        let detailsLink=$('<a href="#">').text('[Read More]').on('click',function(){getDetailsAdd(ad)});
        links.push(detailsLink);
        if(ad._acl.creator == sessionStorage.getItem('userId')){
            let deleteLink=$('<a href="#">').text('[Delete]').on('click',function(){deleteAdd(ad)});
            let editLink=$('<a href="#">').text('[Edit]').on('click',function(){loadAddForEdit(ad)});
            links.push(' ');
            links.push(deleteLink);
            links.push(' ');
            links.push(editLink);
        }

        let tr=$('<tr>')
            .append($('<td>').text(textCutter(ad.title,40)))
            .append($('<td>').text(textCutter(ad.description,80)))
            .append($('<td>').text(ad.publisher))
            .append($('<td>').text(ad.date))
            .append($('<td>').text(ad.price))
            .append($('<td>').append(links));
        adsTable.append(tr);
    }
}

function createAdd(){

    let title=$('#formCreateAd input[name=title]').val();
    let description=$('#formCreateAd textarea[name=description]').val();
    let publisher=sessionStorage.getItem('username');
    let date=$('#formCreateAd input[name=datePublished]').val();
    let price=$('#formCreateAd input[name=price]').val();
    let image=$('#formCreateAd input[name=image]').val();

    if(validateData(title,description,publisher,date,price)) {
        price=parseFloat(price).toFixed(2);
        let addData = {title, description, publisher, date, price,image};

        let postRequest = {
            method: "POST",
            url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/advertisements',
            headers: getKinveyAuthHeaders(),
            data: addData,
            success: createAddSuccess
        };

        function createAddSuccess() {
            listAds();
            showInfo('Advertisement created.')
        }

        $.ajax(postRequest);
    }
}

function loadAddForEdit(add){
    let getRequest={
        method:"GET",
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements/'+add._id,
        headers:getKinveyAuthHeaders(),
        success:loadAddForEditSuccess
    };
    function loadAddForEditSuccess(ad){
        $('#formEditAd input[name=id]').val(ad._id);
        $('#formEditAd input[name=publisher]').val(ad.publisher);
        $('#formEditAd input[name=title]').val(ad.title);
        $('#formEditAd textarea[name=description]').val(ad.description);
        $('#formEditAd input[name=datePublished]').val(ad.date);
        $('#formEditAd input[name=price]').val(ad.price);
        $('#formEditAd input[name=image]').val(ad.image);
        showView('viewEditAd');
    }
    $.ajax(getRequest);
}

function editAdd(){

    let id=$('#formEditAd input[name=id]').val();
    let publisher=$('#formEditAd input[name=publisher]').val();

    let title=$('#formEditAd input[name=title]').val();
    let description=$('#formEditAd textarea[name=description]').val();
    let date=$('#formEditAd input[name=datePublished]').val();
    let price=$('#formEditAd input[name=price]').val();
    let image=$('#formEditAd input[name=image]').val();

    if(validateData(title,description,publisher,date,price)) {
        price=parseFloat(price).toFixed(2);
        let editData = {title, description, publisher, date, price,image};

        let putRequest = {
            method: "PUT",
            url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/advertisements/' + id,
            data: editData,
            headers: getKinveyAuthHeaders(),
            success: editAddSuccess
        };

        function editAddSuccess() {
            listAds();
            showInfo('Advertisement edited.')
        }

        $.ajax(putRequest)
    }
}

function deleteAdd(add){
    let deleteRequest={
        method:"DELETE",
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements/'+add._id,
        headers:getKinveyAuthHeaders(),
        success:deleteAddSuccess
    };
    function deleteAddSuccess(){
        listAds();
        showInfo('Advertisement deleted.')
    }
    $.ajax(deleteRequest)
}

function getDetailsAdd(add){

    let getRequest={
        method:"GET",
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements/'+add._id,
        headers:getKinveyAuthHeaders(),
        success:getDetailsAddSuccess
    };

    $.ajax(getRequest);

    function getDetailsAddSuccess(ad){
        $('#viewDetailsAd').empty();

        let div=$('<div>');
        let img=$('<span>').append($('<img alt="Imagine a wonderful picture here!" height="300" width="400">').attr('src',ad.image));

        // let title=$('<label>').text('Title').append($('<h1>').text(ad.title));
        // let price=$('<label>').text('Price').append($('<h2>').text(ad.price));
        // let description=$('<label>').text('Description').append($('<p>').text(ad.description));
        // let publisher=$('<label>').text('Publisher').append($('<div>').text(ad.publisher));
        // let date=$('<label>').text('Date').append($('<div>').text(ad.date));

        let title=$('<tr>')
            .append($('<th>').text('Title'))
            .append($('<td>').text(ad.title));
        let price=$('<tr>')
            .append($('<th>').text('Price'))
            .append($('<td>').text(ad.price));
        let description=$('<tr>')
            .append($('<th>').text('Description'))
            .append($('<td>').append($('<textarea disabled="true">').val(ad.description)));
        let publisher=$('<tr>')
            .append($('<th>').text('Publisher'))
            .append($('<td>').text(ad.publisher));
        let date=$('<tr>')
            .append($('<th>').text('Date'))
            .append($('<td>').text(ad.date));

        let infoDiv=$('<table id="advertInfo">')
            .append(title)
            .append(price)
            .append(description)
            .append(publisher)
            .append(date)
        div
            .append(img)
            .append(infoDiv)
            .appendTo('#viewDetailsAd');

        showView('viewDetailsAd');
    }

}



