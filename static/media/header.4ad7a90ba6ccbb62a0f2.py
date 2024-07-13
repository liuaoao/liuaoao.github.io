import base64
import hmac
from datetime import datetime
from hashlib import sha256
import hashlib
import uuid



def generate_authorization_headers(method = "POST", access_key = None, secret_key = None, url = None):
    RFC7231_FORMAT = '%a, %d %b %Y %H:%M:%S GMT'
    date_time_string = datetime.utcnow().strftime(RFC7231_FORMAT)
    signature = 'date: %s\n%s %s HTTP/1.1' % (date_time_string, method, url)
    crypto = hmac.new(secret_key.encode('utf-8'), signature.encode('utf-8'), hashlib.sha256)
    hmac_signature = base64.b64encode(crypto.digest()).decode('utf-8')
    authorization = '''hmac accesskey="%s", algorithm="hmac-sha256", headers="date request-line", signature="%s"''' % (
        access_key, hmac_signature)
    return {
        "Date": date_time_string,
        "Content-Type": "application/json",
        "Authorization": authorization,
    }
# 'Authorization': u'(.*?)'}
# {'Date': '(.*?)', 'Content-Type'
print(generate_authorization_headers('POST', 'A7991EB91C424DC4AE7F4FA209409075', '4AE38D56447848FB91B19178490B1A7B',
                                      '/studio/ams/data/v1/chat/completions'))
