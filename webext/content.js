// Only enable on Mastodon instances
let mastodon = document.getElementById('mastodon');

if (mastodon) {

	// Will be storing the messages inside the <noscript> element
	let noscript = mastodon.firstElementChild;

	// Some other extensions turn <noscript> into <span>
	if (noscript && ['NOSCRIPT', 'SPAN'].includes(noscript.tagName)) {

		// The default class colours the text red
		mastodon.removeAttribute('class');

		// Setting noscript.innerHTML escapes HTML so use a div
		let messages = document.createElement('div');
		messages.setAttribute('id', 'messages');
		noscript.replaceChildren(messages);

		// Add a loading indicator for user-friendlyness
		let loading = document.createElement('div');
		loading.textContent = 'Loading content using zygolophodon...';
		loading.setAttribute('id', 'loading');
		mastodon.prepend(loading);

		// Connect to backend via background script
		let background = browser.runtime.connect({ name: 'zygolophodon' });

		// Listen for results data from backend via background script
		background.onMessage.addListener((data) => {
			if (data) {
				// Zero timeout allows browsers to spend some UI cycles first
				setTimeout(() => {
					// Append the recieved data to the messages
					messages.innerHTML += data;
				});
			} else {
				// Backend indicated EOF using the empty string
				// so remove the loading indicator text
				loading.remove();
			}
		});

		// Request zygolophodon load the URL of the current tab
		background.postMessage(window.location.toString());
	}
}