#!/usr/bin/env python3
"""
Servidor HTTP local para o WaveCheck.
Roda sem instalar nada extra (Python 3 já vem no Mac e Linux).

USO:
  python3 server.py

Depois abra: http://localhost:3000
"""
import http.server, socketserver, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        # Só loga erros, não cada request
        if args[1] not in ('200', '304'):
            super().log_message(fmt, *args)
    def end_headers(self):
        # Headers necessários para PWA e Supabase
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

print(f"\n🌊 WaveCheck rodando em http://localhost:{PORT}")
print("   Pressione Ctrl+C para parar\n")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")