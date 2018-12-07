function deleteParts(PartID){
    $.ajax({
        url: '/parts/' + PartID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};


function deleteMopeds(ID){
    $.ajax({
        url: '/mopeds/' + ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};


function deleteCustomers(ID){
    $.ajax({
        url: '/customers/' + ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteInvoices(ID){
    $.ajax({
        url: '/invoices/' + ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletePartsOrders(InvoiceID, PartID){
    $.ajax({
        url: '/partsorders/InvoiceID/' + InvoiceID + '/PartID/' + PartID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
