jQuery(document).ready(function ($) {

    audio=$('#audio');
    has_data_bg=false;
    data_bg={};
    audio[0].volume = 0.6;
    var album_ID;

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
    $.getJSON('http://kslm.oldcat.me/player.php?_=' + $.now()+'&album='+album_ID, function (data) {
        data_bg=data;
        has_data_bg=true;
        $('#audio').attr('src', data.mp3);
        $('#audio')[0].play();
    });
}
