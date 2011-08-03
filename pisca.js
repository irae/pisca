/*!
 * Pisca 0.1
 * https://github.com/irae/pisca
 *
 * Copyright (c) 2011 Iraê Carvalho
 * Dual-licensed under the BSD or MIT licenses. See LICENCE file.
 */

(function(window,document) {
	// Only continue with we have proper pushState.
	// pushState enabling determination from http://bit.ly/lyxYHd
	if(!( window.history && window.history.pushState && window.history.replaceState &&
		!(
			/* disable for versions of iOS before version 4.3 (8F190) */
			(/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) || 
			/* disable for the mercury iOS browser, or at least older versions of the webkit engine */
			(/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent)
		))) {
		return;
	}

	var divState = document.getElementsByTagName('div')[0],
		location=document.location,
		initialUrl = location.href,
		currentUrl = initialUrl,
		popped = ('state' in window.history);

	function writeHTML(html) {
		divState.innerHTML = html;
		if(window.scrollY) {
			window.scrollTo(0, 1);
		}
	}

	function xhrEnd(){
		if (this.readyState == 4) {
			// crop the response to extract only the content of the first div.
			// you MUST have a <div> that wrapps all your body
			// NONE of your <script>s should be inside it
			var stateObj = {},
				text = this.responseText,
				start = text.indexOf('<div'),
				end = text.lastIndexOf('</div>');
			text = text.slice(start,end);
			text = text.slice(text.indexOf('>')+1,-1);
			writeHTML(text);

			// push the browser state
			if(currentUrl != location.href) {
				if(text.length<620*1000) { // size restrictions https://developer.mozilla.org/en/dom/manipulating_the_browser_history
					stateObj.pageHtml = text;
				}
				window.history.pushState(stateObj,'',currentUrl);
			}
	    }
	}

	function getPage(url) {
		currentUrl = url;
		var client = new XMLHttpRequest();
		client.onreadystatechange = xhrEnd;
		client.open("GET", currentUrl);
		client.send();
	}

	window.addEventListener('popstate', function(event) {
		// Ignore inital popstate that some browsers fire on page load
		// https://github.com/defunkt/jquery-pjax/blob/bb5ba4962519a5433bb49c14a87e8bf4da67d4ea/jquery.pjax.js#L194
		var initialPop = !popped && location.href == initialUrl;
		popped = true;
		if(initialPop){
			return;
		}
		if(event.state && 'pageHtml' in event.state) {
			// whooo! cached!
			writeHTML(event.state.pageHtml);
		} else {
			getPage(document.location.href);
		}
	}, false);

	document.addEventListener('click', function(event) {
		if(event.button) {return;} // firefox bug with delegation https://github.com/jquery/jquery/commit/150e44cddaa606f9299d4e44ea8a0c01ad8f7166
		var curnode=event.target, stop=/^(a|html)$/i, chref;
		while (!(stop).test(curnode.nodeName)) {
			curnode=curnode.parentNode;
		}
		if(
			'href' in curnode && // is a link
			(chref=curnode.href).replace(location.href,'').indexOf('#') && // is not an anchor
			(
				!(/^[a-z\+\.\-]+:/i).test(chref) ||                       // either does not have a proper scheme (relative links)
				chref.indexOf(location.protocol+'//'+location.host)===0 ) // or is in the same protocol and domain
		) {
			event.preventDefault();
			getPage(curnode.href);
		}
	},false);
	
	// cache initial state on load
	if(divState.innerHTML.length<620*1000) { // size restrictions https://developer.mozilla.org/en/dom/manipulating_the_browser_history
		window.history.replaceState({pageHtml:divState.innerHTML},'',currentUrl);
	}
	
})(this,document);
