function listAds(){

    let getRequest={
        method:"GET",
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements',
        headers:getKinveyAuthHeaders(),
        success:loadAdsSuccess
    };
    $.ajax(getRequest);

    //Success callback

    function loadAdsSuccess(ads){
        showInfo('Advertisements loaded');
        $('#ads').empty();

        if(ads.length==0){
            $('#books').text('No advertisements available');
        }
        else{
            ads=ads.sort((a,b)=>sortByDate(b._kmd.lmt,a._kmd.lmt));
            
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

        let detailsLink=$(`<a href="#/ads/${ad._id}">`).text('[Read More]')
        links.push(detailsLink);
        if(ad._acl.creator == sessionStorage.getItem('userId')){
            let deleteLink=$(`<a href="#/ads/delete/${ad._id}">`).text('[Delete]');
            let editLink=$(`<a href="#/ads/edit/${ad._id}">`).text('[Edit]');
            links.push(' ');
            links.push(deleteLink);
            links.push(' ');
            links.push(editLink);
        }

        let tr=$('<tr>')
            .append($('<td>').text(textCutter(ad.title,20)))
            .append($('<td>').text(textCutter(ad.description,40)))
            .append($('<td>').append($(`<a href="#/user/${ad._acl.creator}">`).text(ad.publisher)))
            .append($('<td>').text(formatDate(ad._kmd.lmt)))
            .append($('<td>').text(ad.price))
            .append($('<td>').append(links));
        adsTable.append(tr);
    }
}

function createAdd(ev){
    ev.preventDefault();
    let title=$('#formCreateAd input[name=title]').val();
    let description=$('#formCreateAd textarea[name=description]').val();
    let publisher=sessionStorage.getItem('username');
    let price=$('#formCreateAd input[name=price]').val();
    let image=$('#formCreateAd input[name=image]').val();

    if(validateData(title,description,publisher,price)) {
        price=parseFloat(price).toFixed(2);
        let addData = {title, description, publisher, price,image};

        let postRequest = {
            method: "POST",
            url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/advertisements',
            headers: getKinveyAuthHeaders(),
            data: addData,
            success: createAddSuccess
        };

        function createAddSuccess() {
            showInfo('Advertisement created.')
            $(location).attr('href',`#/ads`);
        }

        $.ajax(postRequest);
    }
}

function loadAddForEdit(advertId){
    let getRequest={
        method:"GET",
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements/'+advertId,
        headers:getKinveyAuthHeaders(),
        success:loadAddForEditSuccess
    };
    function loadAddForEditSuccess(ad){
        $('#formEditAd input[name=id]').val(ad._id);
        $('#formEditAd input[name=publisher]').val(ad.publisher);
        $('#formEditAd input[name=title]').val(ad.title);
        $('#formEditAd textarea[name=description]').val(ad.description);
        $('#formEditAd input[name=price]').val(ad.price);
        $('#formEditAd input[name=image]').val(ad.image);
        showView('viewEditAd');
    }
    $.ajax(getRequest);
}

function loadAddForDelete(advertId){
    let getRequest={
        method:"GET",
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements/'+advertId,
        headers:getKinveyAuthHeaders(),
        success:loadAddForDeleteSuccess
    };
    function loadAddForDeleteSuccess(ad){
        $('#formDeleteAd input[name=id]').val(ad._id);
        $('#formDeleteAd input[name=publisher]').val(ad.publisher);
        $('#formDeleteAd input[name=title]').val(ad.title);
        $('#formDeleteAd textarea[name=description]').val(ad.description);
        $('#formDeleteAd input[name=price]').val(ad.price);
        $('#formDeleteAd input[name=image]').val(ad.image);
        showView('viewDeleteAd');
    }
    $.ajax(getRequest);
}

function editAdd(ev){
    ev.preventDefault();

    let id=$('#formEditAd input[name=id]').val();
    let publisher=$('#formEditAd input[name=publisher]').val();

    let title=$('#formEditAd input[name=title]').val();
    let description=$('#formEditAd textarea[name=description]').val();
    let price=$('#formEditAd input[name=price]').val();
    let image=$('#formEditAd input[name=image]').val();

    if(validateData(title,description,publisher,price)) {
        price=parseFloat(price).toFixed(2);
        let editData = {title, description, publisher, price,image};

        let putRequest = {
            method: "PUT",
            url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/advertisements/' + id,
            data: editData,
            headers: getKinveyAuthHeaders(),
            success: editAddSuccess
        };

        function editAddSuccess() {
            showInfo('Advertisement edited.');
            $(location).attr('href',`#/ads`)
        }

        $.ajax(putRequest)
    }
}

function deleteAdd(ev){
    ev.preventDefault();
    let id=$('#formDeleteAd input[name=id]').val();
    
    let deleteRequest={
        method:"DELETE",
        url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements/'+id,
        headers:getKinveyAuthHeaders(),
        success:deleteAddSuccess
    };
    function deleteAddSuccess(){
        showInfo('Advertisement deleted.');
        $(location).attr('href',`#/ads`);
    }
    $.ajax(deleteRequest)
}

function getDetailsAdd(advertId,showReviewsBool){

    //showReviewsBool determines how will the user reviews be displayed
    
    //Kinvey requests
    
    let getAdvertPromise= $.ajax({
            method:"GET",
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements/'+advertId,
            headers:getKinveyAuthHeaders()
    });

    let query=`?query={"advertId":"${advertId}"}`;

    let getReviewsPromise= $.ajax({
            method:"GET",
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/userReviews'+query,
            headers:getKinveyAuthHeaders()
    });

    Promise.all([getAdvertPromise,getReviewsPromise])
        .then(getDetailsAddSuccess);

    //Success callback

    function getDetailsAddSuccess([ad,reviews]){
        $('#viewDetailsAd').empty();

        //Attach the advert info

        let adDiv=$('<div>');
        let img=$('<span>').append($('<img alt="Imagine a wonderful picture here!" height="300" width="400">').attr('src',ad.image));


        let title=$('<tr>')
            .append($('<th>').text('Title'))
            .append($('<td>').text(textCutter(ad.title,60)));
        let price=$('<tr>')
            .append($('<th>').text('Price'))
            .append($('<td>').text(Number(ad.price).toFixed(2)));
        let description=$('<tr>')
            .append($('<th>').text('Description'))
            .append($('<td>').append($('<textarea disabled="true">').val(ad.description)));
        let publisher=$('<tr>')
            .append($('<th>').text('Publisher'))
            .append($('<td>').append($(`<a href="#/user/${ad._acl.creator}">`).text(ad.publisher)));
        let date=$('<tr>')
            .append($('<th>').text('Date'))
            .append($('<td>').text(formatDate(ad._kmd.lmt)));

        let infoDiv=$('<table id="advertInfo">')
            .append(title)
            .append(price)
            .append(description)
            .append(publisher)
            .append(date);



        //Attach advert buttons

        let showReviewsButton=$('<input type="button">').val('User Reviews').on('click',showHideReviews);
        let addReviewButton=$('<input type="button">').val('Post review').on('click',showHideCreateForm);
        let showPurchaseOptionButton=$('<input type="button">').val('Purchase').on('click',showHidePurchaseDetails);

        let adButtons=$('<div id="advertButtons">')
            .append(showReviewsButton)
            .append(addReviewButton)
            .append(showPurchaseOptionButton);


        //Attach the create and edit review form

        let createReviewForm=$('<form id="createReviewForm" >')
            .css('display','none')
            .append($('<div>')
                .append($('<div>').text('Create review:'))
                .append($('<textarea name="body" rows="3" required="true">')))
            .append($('<input type="button">').val('Create').on('click',function (){createReview(advertId)}));


        let editReviewForm=$('<form id="editReviewForm">')
            .css('display','none')
            .append($('<input name="idHolder" disabled>').css('display','none'))
            .append($('<div>')
                .append($('<div>').text('Edit review:'))
                .append($('<textarea name="body" rows="3" required="true">'))
            )
            .append($('<input type="button">').val('Edit').on('click',function (){
                editReview(advertId,$('#editReviewForm input[name=idHolder]').val())
            }));

        //Attach the purchase details

        let purchaseDetailsDiv=$('<div id="purchaseDetails">')
            .css('display','none')
            .append($('<label>').text('Ammount: '))
            .append($('<input type="number" value="1" min="1" name="ammount">').on('input',changeTotalPrice))
            .append($('<div id="totalPrice">').text(`Total price: 1 X ${ad.price} = ${ad.price}`))
            .append($('<input type="button">').val('Confirm purchase').on('click',function(){purchaseItem(ad)}));

        let createEditPurchaseBox=$('<div id="createEditPurchaseBox">')
            .append(createReviewForm)
            .append(editReviewForm)
            .append(purchaseDetailsDiv);

        //Attach all user reviews

        let reviewsDiv=$('<div id="userReviews">');
        if(reviews.length==0){
            reviewsDiv.append($('<div class="userReview">').text('No reviews for this advert.'));
        }
        for(let review of reviews){

            let userReview=$('<div class="userReview">')
                .append($('<div>').append($('<i>').text(review.text)))
                .append($('<div class="reviewDetails">').text(`Commented by ${review.author} on ${formatDate(review._kmd.lmt)}`));

            //Creator can edit/delete his reviews
            if(review._acl.creator==sessionStorage.getItem('userId')){
                userReview.append($('<button>').text('Delete').on('click',function(){deleteReview(advertId,review._id)}))
                userReview.append($('<button>').text('Edit').on('click',function(){
                    $('#editReviewForm input[name=idHolder]').val(review._id);
                    $('#editReviewForm textarea[name=body]').val(review.text);
                    $('#editReviewForm').show();
                    $('#createReviewForm').hide();
                    $('#purchaseDetails').hide();
                    $("html, body").animate({ scrollTop: 0 }, "slow");

                }))
            }

            reviewsDiv.append(userReview);

        }

        // If the advert details page is opened for the first time the reviews are hidden by default, else the screen points towards the edited/created content

        if(!showReviewsBool){
            reviewsDiv.css('display','none');
        }
        else{
            $("html, body").animate({ scrollTop:  $(document).height()}, "slow");
        }

        // All the elements are attached and the main section is displayed
        adDiv
            .append(img)
            .append(infoDiv)
            .append($('<br/>'))
            .append(adButtons)
            .append(createEditPurchaseBox)
            .append(reviewsDiv)
            .appendTo('#viewDetailsAd');

        showDetailsAdView();


        function changeTotalPrice(){
            let purchaseAmmountInput=$('#purchaseDetails input[name=ammount]');
            let quantity=parseInt(purchaseAmmountInput.val());
            if(quantity<=0||!quantity){
                quantity=1;
            }
            purchaseAmmountInput.val(quantity);


            let price=Number(ad.price);
            let totalPrice=quantity*price;
            $('#totalPrice').text(`Total price: ${quantity} X ${price} = ${totalPrice.toFixed(2)}`)
        }
    }

    function showHideReviews(){
        let reviewDiv=$('#userReviews');
        if(reviewDiv.css('display')=='none'){
            reviewDiv.show();
        }
        else{
            reviewDiv.hide();
        }
    }

    function showHideCreateForm(){
        $('#editReviewForm').hide();
        $('#purchaseDetails').hide();
        let createForm=$('#createReviewForm');
        if(createForm.css('display')=='none'){
            createForm.show();
        }
        else{
            createForm.hide();
        }
    }

    function showHidePurchaseDetails(){
        $('#editReviewForm').hide();
        $('#createReviewForm').hide();
        let purchaseDiv=$('#purchaseDetails');
        if(purchaseDiv.css('display')=='none'){
            purchaseDiv.show();
        }
        else{
            purchaseDiv.hide();
        }
    }

}

function createReview(advertId){
    let text=$('#createReviewForm textarea[name=body]').val();
    if(text.length>0){
        let postData={author:sessionStorage.getItem('username'),text,advertId};
        let postRequest={
            method:"POST",
            url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/userReviews',
            headers:getKinveyAuthHeaders(),
            data:postData
        };
        $.ajax(postRequest)
            .then(createReviewSuccess);

        function createReviewSuccess(){
            showInfo('Review created.');

            $(location).attr('href',`#/ads/${advertId}`);
            $(location).attr('href',`#/ads/${advertId}?showRev=true`);
        }
    }
}

function deleteReview(advertId,reviewId){
    let deleteRequest={
        method:"DELETE",
        url:kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/userReviews/'+reviewId,
        headers:getKinveyAuthHeaders()
    };

    $.ajax(deleteRequest)
        .then(deleteSuccess);

    function deleteSuccess(){
        showInfo('Review deleted.');

        $(location).attr('href',`#/ads/${advertId}`);
        $(location).attr('href',`#/ads/${advertId}?showRev=true`);
    }
}

function editReview(advertId,reviewId){

    let text=$('#editReviewForm textarea[name=body]').val();
    if(text.length>0){
        let author=sessionStorage.getItem('username');
        let putData={author,text,advertId};

        let putRequest={
            method:"PUT",
            url:kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/userReviews/'+reviewId,
            headers:getKinveyAuthHeaders(),
            data:putData
        };

        $.ajax(putRequest)
            .then(editSuccess);

        function editSuccess(){
            showInfo('Review edited.')

            $(location).attr('href',`#/ads/${advertId}`);
            $(location).attr('href',`#/ads/${advertId}?showRev=true`);
        }
    }
}

function purchaseItem(advert){
    let title=advert.title;
    let price=advert.price;
    let quantity=$('#purchaseDetails input[name=ammount]').val();
    let advertId=advert._id;
    let sellerId=advert._acl.creator;
    let buyerName=sessionStorage.getItem('username');

    let postData={title,price,quantity,advertId,sellerId,buyerName};

    let postRequest={
        method:"POST",
        url:kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/userPurchases/',
        headers:getKinveyAuthHeaders(),
        data:postData
    };

    $.ajax(postRequest)
        .then(purchaseSuccess);

    function purchaseSuccess(){
        showInfo('Purchase successful.');

        $(location).attr('href',`#/user/${sessionStorage.getItem('userId')}`);
        
    }
}

function getUserDetails(userId){

    let loggedInUserId=sessionStorage.getItem('userId');

    // User details for the logged in user

    if(userId==loggedInUserId){
        let advertisementsQuery=`?query={"_acl.creator":"${userId}"}`;
        let userAdvertsRequest={
            method:"GET",
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements'+advertisementsQuery,
            headers:getKinveyAuthHeaders()
        };
        let advertisementsPromise=$.ajax(userAdvertsRequest);


        let salesQuery=`?query={"sellerId":"${loggedInUserId}"}`;
        let salesRequest={
            method:"GET",
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/userPurchases'+salesQuery,
            headers:getKinveyAuthHeaders()
        };
        let salesPromise=$.ajax(salesRequest);


        let purchasesQuery=`?query={"_acl.creator":"${loggedInUserId}"}`;
        let purchasesRequest={
            method:"GET",
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/userPurchases'+purchasesQuery,
            headers:getKinveyAuthHeaders()
        };
        let purchasesPromise=$.ajax(purchasesRequest);


        let userRequest={
            method:"GET",
            url:kinveyBaseUrl+'user/'+kinveyAppKey+'/'+loggedInUserId,
            headers:getKinveyAuthHeaders()
        };
        let userPromise=$.ajax(userRequest);

        Promise.all([advertisementsPromise,salesPromise,purchasesPromise,userPromise])
            .then(detailsLoadSuccess);


        //Success callback

        function detailsLoadSuccess([advertisements,sales,purchases,user]){

            showInfo('User profile loaded');

            let userDetails=$('#userDetails');
            userDetails.empty();

            //User information

            let userInfo=$('<div id="userInfo">')
                .append($('<h1>').text(user.username));
            if(user.fullname.length>0){
                userInfo
                    .append($('<table>')
                        .append($('<tr>').append($('<td>').text('Fullname:  ')).append($('<td>').text(user.fullname)))
                        .append($('<tr>').append($('<td>').text('Email:  ')).append($('<td>').text(user.email)))
                    )
            }
            else{
                userInfo
                    .append($('<table>')
                        .append($('<tr>').append($('<td>').text('Email:  ')).append($('<td>').text(user.email)))
                    )
            }


            //User Advertisements

            let myAdverts=$('<div id="myAdverts">')
                .css('display','inline-block')
                .append($('<h3>').text('My adverts'));

            let advertTable=$('<table>');

            if(advertisements.length>0){
                advertTable
                    .append($('<tr>')
                        .append($('<th>').text('Title'))
                        .append($('<th>').text('Price'))
                        .append($('<th>').text('Buyers'))
                    );
                for(let advert of advertisements){
                    let advertSales=sales.filter(x=>x.advertId==advert._id);


                    //Sales of the advertisement
                    let salesInfo=$('<div>');

                    if(advertSales.length>0){
                        salesInfo
                            .css('display','none')
                            .append($('<tr>')
                                .append($('<th>').text('Buyer'))
                                .append($('<th>').text('Ammount'))
                                .append($('<th>').text('Total')));

                        for(let sale of advertSales){
                            salesInfo
                                .append($('<tr>')
                                    .append(
                                        $('<td>').append($(`<a href="#/user/${sale._acl.creator}">`).text(sale.buyerName))
                                    )
                                    .append($('<td>').text(sale.quantity))
                                    .append($('<td>').text(Number(sale.quantity)*Number(sale.price))))
                        }
                    }
                    else{
                        salesInfo.css('display','none').append($('<tr>').append($('<td>').text('No sales')));
                    }


                    advertTable
                        .append($('<tr>')
                            .append($('<td>').append($(`<a href="#/ads/${advert._id}">`).text(textCutter(advert.title,20))))
                            .append($('<td>').text(advert.price))
                            .append($('<td>').append($('<input type="button">')
                                .val(advertSales.length)
                                .on('click',function(){showHideSalesInfo(salesInfo)})
                            ))
                        )
                        .append(salesInfo);
                }

            }
            else{
                advertTable.append($('<tr>').append($('<td>').text('No advertisements')));
            }
            myAdverts.append(advertTable);

            function showHideSalesInfo(salesInfo){
                if(salesInfo.css('display')=='none'){
                    salesInfo.show();
                }
                else{
                    salesInfo.hide();
                }
            }

            //User Purchases

            let myPurchases=$('<div id="myPurchases">')
                .css('display','inline-block').css('padding-left','10px')
                .append($('<h3>').text('My purchases'));
            let purchasesTable=$('<table>');

            if(purchases.length>0){
                purchasesTable
                    .append($('<tr>')
                        .append($('<th>').text('Title'))
                        .append($('<th>').text('Ammount'))
                        .append($('<th>').text('Price'))
                        .append($('<th>').text('Total'))
                        .append($('<th>').text('Action'))
                    );
                for(let purchase of purchases){
                    purchasesTable
                        .append($('<tr>')
                            .append($('<td>').append($(`<a href="#/ads/${purchase.advertId}">`).text(textCutter(purchase.title,20))))
                            .append($('<td>').text(purchase.quantity))
                            .append($('<td>').text(Number(purchase.price).toFixed(2)))
                            .append($('<td>').text((Number(purchase.price)*Number(purchase.quantity)).toFixed(2)))
                            .append($('<td>').append($('<input type="button">').val('Cancel purchase').on('click',function(){cancelPurchase(purchase._id,userId)})))
                        );
                }
            }
            else{
                purchasesTable.append($('<tr>').append($('<td>').text('No purchases')));
            }

            myPurchases.append(purchasesTable);

            userDetails
                .append(userInfo)
                .append(myAdverts)
                .append(myPurchases);

            showUserDetailsView();
        }
    }


    //User details for different users
    else{

        let advertisementsQuery=`?query={"_acl.creator":"${userId}"}`;
        let userAdvertsRequest={
            method:"GET",
            url:kinveyBaseUrl+'appdata/'+kinveyAppKey+'/advertisements'+advertisementsQuery,
            headers:getKinveyAuthHeaders()
        };
        let advertisementsPromise=$.ajax(userAdvertsRequest);

        let userRequest={
            method:"GET",
            url:kinveyBaseUrl+'user/'+kinveyAppKey+'/'+userId,
            headers:getKinveyAuthHeaders()
        };
        let userPromise=$.ajax(userRequest);

        Promise.all([advertisementsPromise,userPromise])
            .then(userDetailsLoadSuccess);


        //Success callback

        function userDetailsLoadSuccess([advertisements,user]){
            showInfo('User profile loaded');
            
            let userDetails=$('#userDetails');
            userDetails.empty();

            //User information
            
            let userInfo=$('<div id="userInfo">')
                .append($('<h1>').text(user.username));
            if(user.fullname.length>0){
                userInfo
                    .append($('<table>')
                        .append($('<tr>').append($('<td>').text('Fullname:  ')).append($('<td>').text(user.fullname)))
                        .append($('<tr>').append($('<td>').text('Email:  ')).append($('<td>').text(user.email)))
                    )
            }
            else{
                userInfo
                    .append($('<table>')
                        .append($('<tr>').append($('<td>').text('Email:  ')).append($('<td>').text(user.email)))
                    )
            }

                
            let userAdverts=$('<div id="userAdverts">')
                .css('display','inline-block')
                .append($('<h3>').text('User adverts'));

            let advertTable=$('<table>');

            if(advertisements.length>0){
                advertTable
                    .append($('<tr>')
                        .append($('<th>').text('Title'))
                        .append($('<th>').text('Description'))
                        .append($('<th>').text('Date Published'))
                        .append($('<th>').text('Price'))
                    );
                for(let advert of advertisements){
                    advertTable
                        .append($('<tr>')
                            .append($('<td>').append($(`<a href="#/ads/${advert._id}">`).text(advert.title)))
                            .append($('<td>').text(textCutter(advert.description)))
                            .append($('<td>').text(formatDate(advert._kmd.lmt)))
                            .append($('<td>').text(advert.price))
                        );
                }
            }
            else{
                advertTable.append($('<tr>').append($('<td>').text('No advertisements')));
            }
            userAdverts.append(advertTable);

            userDetails
                .append(userInfo)
                .append(userAdverts);

            showUserDetailsView();
        }
    }

}

function cancelPurchase(purchaseId,userId){
    let deleteRequest={
        method:"DELETE",
        url:kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/userPurchases/'+purchaseId,
        headers:getKinveyAuthHeaders()
    };
    $.ajax(deleteRequest)
        .then(deleteSuccess);
    function deleteSuccess(){
        $(location).attr('href',`#/user/${userId}?deleteReq=true`);
        $(location).attr('href',`#/user/${userId}`);
        showInfo('Purchase canceled.')
    }
}
