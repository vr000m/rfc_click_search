## My first chrome extension.

I often find myself reading RFCs or drafts and sometimes they are not the
https://tools.ietf.org/html/* version. 
This plugin:

* converts non-HTML URL to the HTML-ized URL. 

* If you `selected text` which is of type `RFC XXXX` or `draft-*` 
and click the extension then it will send the `selected text` to
the IETF backend and will try to find the document. If the document is
found, it will open the link in another browser tab.
