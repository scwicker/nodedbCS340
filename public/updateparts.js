function updateParts(PartID){
    $.ajax({
        url: '/parts/' + PartID,
        type: 'PUT',
        data: $('#update-parts').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};


function updateMopeds(ID){
    $.ajax({
        url: '/mopeds/' + ID,
        type: 'PUT',
        data: $('#update-mopeds').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function updateCustomers(ID){
    $.ajax({
        url: '/customers/' + ID,
        type: 'PUT',
        data: $('#update-customers').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function updateInvoices(ID){
    $.ajax({
        url: '/invoices/' + ID,
        type: 'PUT',
        data: $('#update-invoices').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};


function updatePartsOrders(InvoiceID, PartID){
    $.ajax({
        url: '/partsorders/InvoiceID/' + InvoiceID + '/PartID/' + PartID,  //might need to put '' here +
        type: 'PUT',
        data: $('#update-partsorders').serialize(),
        success: function(result){
            window.location.replace("/partsorders");
        }
    })
};
