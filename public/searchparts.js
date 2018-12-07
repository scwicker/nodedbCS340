
function searchParts() {
    //get the first name
    var part_name_search  = document.getElementById('part_name_search').value

    //construct the URL and redirect to it
    window.location = '/parts/search/' + encodeURI(part_name_search)
}



function searchMopeds() {
    //get the first name
    var moped_name_search  = document.getElementById('moped_name_search').value

    //construct the URL and redirect to it
    window.location = '/mopeds/search/' + encodeURI(moped_name_search)
}

function searchCustomers() {
    //get the first name
    var customer_name_search  = document.getElementById('customer_name_search').value

    //construct the URL and redirect to it
    window.location = '/customers/search/' + encodeURI(customer_name_search)
}

function searchInvoices() {
    //get the first name
    var invoice_name_search  = document.getElementById('invoice_name_search').value

    //construct the URL and redirect to it
    window.location = '/invoices/search/' + encodeURI(invoice_name_search)
}
