 'use strict';

const makeupURL = 'https://makeup-api.herokuapp.com/api/v1/products.json';

//watch form 
//prevent submit btn default 
//collect values for user input
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const tag = $('#tag').val();
        const searchTerm = $('#product-type').val();
        const brand = $('#brand').val();
        const minPrice = $('#min-price-input').val();
        const maxPrice = $('#max-price-input').val();
        getMakeUp(tag, searchTerm, brand, minPrice, maxPrice);
        // getYoutubeVideo(searchTerm, brand);
    });
}

//format url 
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getMakeUp(tag, searchTerm, brand, minPrice, maxPrice) {
    const params = {
        product_tags: tag,
        product_type: searchTerm,
        brand: brand,
        price_greater_than: minPrice,
        price_less_than: maxPrice,
    };

    const queryString = formatQueryParams(params)
    const url = makeupURL + '?' + queryString;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayResults(responseJson) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('#results-list').empty();

    //if there are no results, display a msg
    if (!Object.keys(responseJson).length) {
        $('#results-list').append(`<h2>Sorry, No Products Found For That Make-Up and/or Brand</h2>`);
    }
    // iterate through the items array
    for (let i = 0; i < responseJson.length; i++) {

        // for each makeup object in the items array, add a list item to the results 
        //list with the full name, img, price, description, url
        $('#results-list').append(
            `<li class="each-product-result">
      <h3 class="product-name">${responseJson[i].name}</h3>
      <img class="product-img" src="${responseJson[i].image_link}">

      <br>

      <p class="product-price">$${responseJson[i].price}</p>
      <p class="product-description">${responseJson[i].description}</p>
      </li>`
        )
    };

    //display the results section  
    $('#results').removeClass('hidden');

    //clear input after results load
    $('#tag').val('')
    $('#product-type').val('')
    $('#brand').val('')
    $('#min-price-input').val('');
    $('#max-price-input').val('');
};

$(watchForm);