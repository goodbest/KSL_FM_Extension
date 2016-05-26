    jQuery(document).ready(function ($) {

    audio=$('#audio');
    has_data_bg=false;
    data_bg={};
    audio[0].volume = 0.6;
    var album_ID;
    popup_url=chrome.extension.getURL('popup.html');

    audio.on({
        'playing': function () {
            chrome.browserAction.setBadgeBackgroundColor({
                'color': '#0000A0'
                });
            chrome.browserAction.setBadgeText({
                'text': 'ON'
            });
        },
        'pause': function () {
            chrome.browserAction.setBadgeText({
                'text': ''
            });
        },
        'ended': function () {
            audio[0].pause();
            loadMusic(album_ID);
        },
        'loadstart': function () {
            if(has_data_bg){
                chrome.browserAction.setBadgeBackgroundColor({
                    'color': '#FFC02E'
                });
                chrome.browserAction.setBadgeText({
                    'text': 'Load'
                });
            };
        },
        'error': function () {
            if(has_data_bg){
                chrome.browserAction.setBadgeBackgroundColor({
                    'color': '#C02020'
                });
                chrome.browserAction.setBadgeText({
                    'text': 'Error'
                });
            };
        }
    });

});

function loadMusic(album_ID) {
    if (typeof album_ID === 'undefined') {
        album_ID = ''; 
    }
    if (album_ID != ''){
        queryAlbumID = '/'+album_ID;
    }
    else{
        queryAlbumID = '';
    }
    br = getBitRate();
    $.getJSON('http://kslm.oldcat.me/api/KSL' + queryAlbumID + '/' +br, function (data) {
        data_bg=data;
        has_data_bg=true;
        $('#audio').attr('src', data.url);
        $('#audio')[0].play();

        var views=chrome.extension.getViews();
        for (var i = 0; i<views.length; i++){
            var view = views[i]
            if (view.location.href==popup_url){
                // find popup.html
                view.cover.attr({
                    'src': data.cover + '?param=350y350',
                    'data-src': data.cover
                });
                view.title.html(data.title);
                view.artist.html(data.artist);
                view.ksl_id.html(data.album);
                view.ksl_id.attr({
                    'title' : data.ksl_id
                });
                view.olrc = data.olrc;
                view.lrc_row.html(" ");
                view.tlrc = data.tlrc;
                view.tlrc_row.html(" ");
            }
        }
    });
}

function getBitRate(){
    default_br=192;
    if(typeof(Storage) === "undefined") {
        return default_br;
    }
    br = localStorage.getItem("bitrate");
    br = br ? br : default_br;
    return br;
}

