$(function() {

  Stripe.setPublishableKey('pk_test_uRwtVdJxHItbSzIpIhuFx6Dr');

	$('#search').keyup(function(){
		var search_term = $(this).val();

		$.ajax({
			method: 'POST',
			url: '/api/search',
			data: {
				search_term
			},
			dataType: 'json',

			success: function(json) {
				var data = json.hits.hits.map(function(hit) {
					return hit;
				});

				$('#search_results').empty();
				for (var i = 0; i < data.length; i++) {
					var html = "";
          html += '<div class="col-md-4">';
          html += '<a href="/product/' + data[i]._source._id + '">';
          html += '<div class="thumbnail">';
          html += '<img src="' +  data[i]._source.image + '">';
          html += '<div class="caption">';
          html += '<h3>' + data[i]._source.name  + '</h3>';
          html += '<p>' +  data[i]._source.category.name  + '</h3>'
          html += '<p>$' +  data[i]._source.price  + '</p>';
          html += '</div></div></a></div>';

          $('#search_results').append(html);

				}
			},

			error: function(err) {
				console.log(err);
			}
		});
	});


	$(document).on('click', '#plus', function(e) {
		e.preventDefault();
		var priceValue = parseFloat($('#price_value').val());
		var quantity = parseInt($('#quantity').val());

		priceValue += parseFloat($('#price_hidden').val());
		quantity += 1;

		$('#quantity').val(quantity);
		$('#price_value').val(priceValue.toFixed(2));
		$('#total').html(quantity);
	});


	$(document).on('click', '#minus', function(e) {
		e.preventDefault();
		var priceValue = parseFloat($('#price_value').val());
		var quantity = parseInt($('#quantity').val());

		if(quantity == 1) {
			priceValue = $('#price_hidden').val();
			quantity = 1;
		} else {
			priceValue -= parseFloat($('#price_hidden').val());
			quantity -= 1;
		}

		$('#quantity').val(quantity);
		$('#price_value').val(priceValue.toFixed(2));
		$('#total').html(quantity);
	});


	function stripeResponseHandler(status, response) {
		var $form = $('#payment-form');
		if (response.error) {
			$form.find('.payment-errors').text(response.error.message);
			$form.find('.submit').prop('disabled', false); // Re-enable submission
		} else {
			var token = response.id;
			// Insert the token ID into the form so it gets submitted to the server:
			$form.append($('<input type="hidden" name="stripeToken">').val(token));
			$form.get(0).submit();
		}
	}


	var $form = $('#payment-form');
	$form.submit(function(event) {
		// Disable the submit button to prevent repeated clicks:
		$form.find('.submit').prop('disabled', true);
		// Request a token from Stripe:
		Stripe.card.createToken($form, stripeResponseHandler);
		// Prevent the form from being submitted:
		return false;
	});



})
