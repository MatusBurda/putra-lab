"""Static server for the lab with Cache-Control: no-store, so a plain refresh always shows the latest build.

The stdlib http.server sends no Cache-Control, so browsers cache index.html heuristically and keep
showing an old lab (e.g. without new sections) for hours.

    /usr/bin/python3 tools/serve.py [port]
"""
import http.server
import os
import sys
from functools import partial


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4410
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    handler = partial(NoStoreHandler, directory=root)
    with http.server.ThreadingHTTPServer(("", port), handler) as httpd:
        print(f"Putra Lab on http://localhost:{port}/")
        httpd.serve_forever()
