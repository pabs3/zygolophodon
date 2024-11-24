# Copyright © 2025 Paul Wise
# SPDX-License-Identifier: MIT

import struct

webext_debug = sys.stdout.isatty()
webext_msg_max_size = 1024 * 1024
webext_length_struct = '@I'
webext_length_struct_size = struct.calcsize(webext_length_struct)

class WebExt(io.TextIOBase):

    def __init__(self):
        super().__init__()
        self._stdout = sys.__stdout__

    def _get_fp(self):
        if http.client.HTTPConnection.debuglevel:
            # Eww, FIXME in Python?
            # http.client prints debug messages to stdout.
            # Let's redirect them to stderr:
            for frameinfo in inspect.stack(context=0):
                if frameinfo.filename == http.client.__file__:
                    return sys.__stderr__
        return self._stdout

    def flush(self):
        self._get_fp().flush()

    def _write_message(self, message):
        fp = self._get_fp()

        if message == '\n':
            message = '<br/>'

        if message == '-' * text_width:
            message = '<hr/>'

        if webext_debug:
            message = message.encode('utf-8')
            length = b''
        else:
            message = json.dumps(message, separators=(',', ':')).encode('utf-8')
            length = struct.pack(webext_length_struct, len(message))

        fp.buffer.write(length)
        fp.buffer.write(message)
        fp.buffer.flush()

    def write(self, s):
        while True:
            message, s = s[:webext_msg_max_size], s[webext_msg_max_size:]
            self._write_message(message)
            if not s:
                break

def webext(ap, opts):
    global fmt_html, fmt_emojis, fmt_url, fmt_user, fmt_date
    fmt_html = html_fmt_html
    fmt_emojis = html_fmt_emojis
    fmt_url = html_fmt_url
    fmt_user = html_fmt_user
    fmt_date = html_fmt_date
    with WebExt.install():
        while True:
            if webext_debug:
                # Read the address as a line
                addr = sys.stdin.readline()
                if not addr: sys.exit(0)
                addr = addr.rstrip('\r\n')
                if not addr: continue
            else:
                # Read the address from a WebExtension native-message
                length = sys.stdin.buffer.read(webext_length_struct_size)
                if len(length) == 0: sys.exit(0)
                length = struct.unpack(webext_length_struct, length)[0]
                addr = json.loads(sys.stdin.buffer.read(length).decode('utf-8'))
            match = parse_addr(addr)
            process_addr_match(opts, match)
            # Signal EOF to the frontend using an empty string
            sys.stdout.write('')
            if webext_debug:
                print('\n', file=sys.stdout._stdout)

@staticmethod
@contextlib.contextmanager
def install():
    assert sys.stdout is sys.__stdout__
    try:
        with WebExt() as sys.stdout:
            yield
    finally:
        sys.stdout = sys.__stdout__
