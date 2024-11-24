# Copyright © 2025 Paul Wise
# SPDX-License-Identifier: MIT

PREFIX = /usr/local
DESTDIR =

libexecdir = $(PREFIX)/libexec/zygolophodon
webextdir = $(PREFIX)/share/webext/zygolophodon
firefoxwebextdir = $(PREFIX)/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}
chromiumwebextdir = $(PREFIX)/share/chromium/extensions
firefoxnativedir = $(PREFIX)/lib/mozilla/native-messaging-hosts
chromiumnativedir = /etc/chromium/native-messaging-hosts

.PHONY: install
install: manifest.json background.js content.js firefox.json chrome.json native
	install -D manifest.json $(DESTDIR)$(webextdir)/manifest.json
	install -D background.js $(DESTDIR)$(webextdir)/background.js
	install -D content.js $(DESTDIR)$(webextdir)/content.js
	ln -sf $(webextdir) $(DESTDIR)$(firefoxwebextdir)/zygolophodon@jwilk.net
	ln -sf $(webextdir) $(DESTDIR)$(chromiumwebextdir)/zygolophodon
	for f in firefox.json chrome.json ; do \
		sed -E \
			-e 's#@libexecdir@#$(libexecdir)#' \
			-e '/"(copyright|license)"/d' \
			< "$$f" \
			> "$$f.tmp" ; \
	done
	install -D firefox.json.tmp $(DESTDIR)$(firefoxnativedir)/zygolophodon.json
	install -D chrome.json.tmp $(DESTDIR)$(chromiumnativedir)/zygolophodon.json
	install -D native $(DESTDIR)$(libexecdir)/webext-native
	rm -f firefox.json.tmp chrome.json.tmp

.PHONY: clean
clean:
	rm -f *.tmp

.error = GNU make is required

# vim:ts=4 sts=4 sw=4 noet
