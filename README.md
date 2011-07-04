	________     _____                                    ______
	___  __ \    ___(_)  ________   _______   ______ _    ___  /
	__  /_/ /    __  /   __  ___/   _  ___/   _  __ `/    __  / 
	_  ____/     _  /    _(__  )    / /__     / /_/ /      /_/  
	/_/          /_/     /____/     \___/     \__,_/      (_)   
                                                            
------------------------------------------------------------

Pisca is a small framework to leverage modern browsers history management, via pushState,
popState and replaceState.

The goal is to function without any serve side changes and provide a very fast way to
navigate, with minimal network requests. This project is specially targeted to mobile
devices, but can be used on desktop browsers too.

How it works
------------

Pisca assumes that you have the following `<html>` skeleton:

```html
<!doctype html>
<html>
<head>
	<!-- your metas, title, some scripts if you must, etc. -->
</head>
<body>
	<div> <!-- having a wrapper div is mandatory. feel free to add id, classes, etc -->

		<!-- All your HTML content here. We don't support CSS and JS here. -->

	</div> <!--! end of wrapper div -->

	<!-- All your extra scripts, extra anything that won't change during  -->
	<script src="pisca.js"></script>
</body>
</html>
```

This skeleton is the case for most simple websites. If you don't have many `<script>`s or CSSs
and need to serve then only on certain pages, this is probably what you are already doing
anyway.

What Pisca does is use event delegation to trigger an Ajax call on all your links. This ajax
gets the url for the link, strip down your skeleton and inserts the new content on the wrapper
`<div>`, causing navigation to be much, much faster, regardless of HTTP headers optimizations
you may do on your server, this will be faster. All javascript and css and some of the DOM
is already parsed and browsers won't have to do that again.

We do some caching too. If you use the history buttons, you will experience instant back and
forward actions when the size of the content was within browser history state limits.

Pisca Name
----------

In portuguese, “pisca” means “flashed”, like in “some light flashed”.

TODOS
-----

* Improve this README with proper English =)
* Create demo pages and host them with proper http headers for images
* Expose an API for callbacks
* Keep core very small, make a separate file for globalStorage and localStorage management instead
  of relying on event.state and manage expiration dates
