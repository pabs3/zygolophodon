// Copyright © 2025 Paul Wise
// SPDX-License-Identifier: MIT

let content;
let backend;

// When the content script connects
browser.runtime.onConnect.addListener((port) => {

	// Connect to the backend
	backend = browser.runtime.connectNative('zygolophodon');

	// The backend disconnecting indicates it crashed
	backend.onDisconnect.addListener((port) => {
		if (port.error) { console.log(`Error: ${port.error.message}`); }
		else { console.log(`Disconnected`, port); }
	});

	// Store the current content port for use by forwarders
	content = port;

	// Forward backend responses to the content script
	backend.onMessage.addListener((response) => {
		content.postMessage(response);
	});

	// Forward content script requests to the backend
	content.onMessage.addListener((message) => {
		backend.postMessage(message);
	});

});
