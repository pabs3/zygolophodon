let mastodon = document.getElementById("mastodon");
if (mastodon && 'noscript' in mastodon) {
	let zygolophodon = document.createElement("div");
	zygolophodon.textContent = "Loading content using zygolophodon...";
	zygolophodon.setAttribute("id", "zygolophodon");
	mastodon.noscript.replaceChildren();
	mastodon.prepend(zygolophodon);

	let background = browser.runtime.connect({ name: "zygolophodon" });
	background.onMessage.addListener((message) => {
		if (message) {
			mastodon.noscript.innerHTML += message;
		} else {
			zygolophodon.remove();
		}
	});
	background.postMessage(window.location.toString());
}
