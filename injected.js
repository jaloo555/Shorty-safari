function log(message) {
	safari.self.tab.dispatchMessage('logger', message);
}

function handleMessage(msg) {
	if (msg.name === 'getselection') {

		var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		var firstTest = window.getSelection().focusNode.parentNode.href;
		var firsturltest=urlRegex.test(firstTest);
		var secondTest = window.getSelection();
		var secondURLTest = urlRegex.test(secondTest);

		if (firsturltest) {
			var urlsel = window.getSelection().focusNode.parentNode.href;
			safari.self.tab.dispatchMessage('theselection', urlsel);
		} else if (secondURLTest) {
			var textsel = window.getSelection();
			safari.self.tab.dispatchMessage('theselection', textsel);
		}
		else {
			safari.self.tab.dispatchMessage('wrongurl');
		}
	}
	else if (msg.name === 'getcurrenturl') {
		var url = window.location.href;
		safari.self.tab.dispatchMessage('currenturl', url);
	}
	else if (msg.name === 'bitlyshort') {
    	// msg name to be dispatched - shortedurl
    	log('message received');
    	get_short_url(msg.message,'bb7a90a8368ab0b0b2a292b83c2efafe87bd8378');
    }
}

function get_short_url(long_url, access_token)
{
	var called = false;
	$.getJSON(
		"https://api-ssl.bitly.com/v3/shorten?", 
		{ 
			"format": "json",
			"access_token": access_token,
			"longUrl": long_url
		},
		function(response)
		{
			log('response:');
			log(called);
			if (!called) {
				safari.self.tab.dispatchMessage('shortedurl', response.data.url);
				log('responded!');
			}
			called = true;
		}
		);
}



safari.self.addEventListener('message', handleMessage, false);
