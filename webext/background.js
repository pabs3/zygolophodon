let content;
let native;

browser.runtime.onConnect.addListener((port) => {
	native = browser.runtime.connectNative("zygolophodon");
	native.onDisconnect.addListener((port) => {
		if (port.error) { console.log(`Error: ${port.error.message}`); }
		else { console.log(`Disconnected`, port); }
	}
	native.onMessage.addListener((response) => {
		content.postMessage(response);
	});

	content = port;
	content.onMessage.addListener((message) => {
		native.postMessage(message);
	});
});
