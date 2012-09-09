var url_ietf = /www.ietf.org\//;
var url_dc = /www.rfc-editor.org\//;
//var url_tools_ietf = /tools.ietf.org\//;

function updateUrl(tab) {
    if (tab.url.match(url_ietf) || tab.url.match(url_dc))
    //||tab.url.match(url_tools_ietf))
    {
        var tabUrl = tab.url;
        var path = tabUrl.split("/");
        var xrfc = path[path.length - 1]; 
        //should be 4 => http://*/id/?.txt
        xrfc = xrfc.split(".");
        var rfc = xrfc[0];
        var newurl = "https://tools.ietf.org/html/" + rfc;
        //var newurl = tab.url.replace(url_ietf, url_tools_ietf);
        chrome.tabs.update(tab.id, {
            url: newurl
        });
        return 1;
    }
    return 0;
}

chrome.browserAction.onClicked.addListener(function(tab) {
    var x = updateUrl(tab);
    if (x == 0) {
        chrome.tabs.sendRequest(tab.id, {
            method: "getSelection"
        }, function(response) {
            sendServiceRequest(response.data);
        });
    }
});

function sendServiceRequest(selectedText) {
    if (selectedText == "") return 0;
    if (!isNaN(selectedText)) {
        //if it is just a number it is prolly an RFC number...
        //is the number valid? as in we know what is the highest rfc number
        serviceCall = 'http://tools.ietf.org/html/rfc' + selectedText;
    } else {
        //remove all spaces 
        //selectedText=selectedText.replace(/ /g,"");
/*
            remove all non-alphanumeric characters but,
            want to ignore all special chars except dashes.
            dashes are valid in draft-singh-avtcore...
        */
        //convert to lower case
        selectedText = selectedText.toLowerCase();
        //check if there is an rfc ... this should probably be a regex?
        var d = selectedText.search("rfc");
        len = selectedText.length
        var serviceCall = '';
        if (d == -1) {
            /*
                Test Vectors:
                SDP: Session Description Protocol
                SDP
                (STD 1)
                1 Oct 2011  draft-singh-avtcore-mprtp  txt
                draft-singh-avtcore-mprtp-05 - Multipath RTP (MPRTP)
            */
            var str = selectedText.search("draft");
            len = selectedText.length
            //from "draft" to end of string
            if (str != -1) {
                selectedText = selectedText.substring(str, len);
                str = selectedText.search("txt");
                if (str != -1) {
                    //from beginning to "."
                    selectedText = selectedText.substring(0, str);
                }
                str = selectedText.search(" ");
                if (str != -1) {
                    //from beginning to "", 
                    //we ignore any text after the space
                    selectedText = selectedText.substring(0, str);
                }
            } else {
                //lets also Google Search it?
                googleURL = 
                    'https://www.google.com/search?q=' + selectedText;
                chrome.tabs.create({
                    url: googleURL
                });
            }
            serviceCall = 'http://tools.ietf.org/html/' + selectedText;
        } else {
            /*
                Test Vectors:
                ftp://ftp.isi.edu/in-notes/rfc2327.txt
                RFC - 2327
                RFC 2327:SDP: Session Description Protocol
                (Obsoleted by RFC-4566 prop)
            */
            // remove spaces
            selectedText = selectedText.replace(/[^a-zA-Z0-9-]+/g, '');
            //string contains rfc
            //remove all non-alphanumeric characters
            //selectedText=selectedText.replace(/[^a-zA-Z0-9]+/g,'');
            //is it possible that we still have some crap?
            selectedText = selectedText.match(/[0-9]+/g);
            selectedText = 'rfc' + selectedText[0];
            serviceCall = 'http://tools.ietf.org/html/' + selectedText;
        }
    }
    chrome.tabs.create({
        url: serviceCall
    });
    //chrome.tabs.update(tab.id, {url: serviceCall});
}
