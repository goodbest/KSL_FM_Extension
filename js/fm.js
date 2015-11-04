
jQuery(document).ready(function ($) {
        album = $('.audio-album');
        cover = $('#cover_img');
        title = $('#title');
        artist = $('#artist');
        ksl_id = $('#ksl_id');
        lrc_row = $("#lrc");
        tlrc_row = $("#tlrc");
        elapsed = $('.elapsed');
        shade = $('.shade-layer');
        lrc = "";
        tlrc = "";
        lrc_interval = null;
        volume = $("#volume");
    home = 'http://ksl.oldcat.me/index_music.html';  // homepage

    album_ID='';
    audio=chrome.extension.getBackgroundPage().$('#audio');
    data_bg=chrome.extension.getBackgroundPage().data_bg;
    has_data_bg=chrome.extension.getBackgroundPage().has_data_bg;
    
    if (has_data_bg){
        title.html(data_bg.title);
        artist.html(data_bg.artist);
        ksl_id.html(data_bg.album);
        ksl_id.attr({
            'title' : data_bg.ksl_id
        });
        cover.attr({
            'src': data_bg.cover + '?param=350y350',
            'data-src': data_bg.cover
        });
        if (data_bg.lrc != " " || data_bg.tlrc != " ") {
            lrc=data_bg.lrc;
            tlrc=data_bg.tlrc;
            lrc_interval = setInterval("display_lrc()", 200);
        }
    }

    if (!audio[0].paused){        
        album.removeClass('paused');
        shade.find('.fa').removeClass('fa-play').addClass('fa-pause');
        if (lrc != " " || tlrc != " ") {
            lrc_interval = setInterval("display_lrc()", 200);
        }

    }

    $(document).bind('keydown', 'n', function(){
        loadMusic(album_ID);
    });
    $(document).bind('keydown', 'right', function(){
        loadMusic(album_ID);
    });
    $(document).bind('keydown', 'p', function(){
        shade.click();
    });
    $(document).bind('keydown', 'space', function(){
        shade.click();
    });
    $(document).bind('keydown', 'up', function(){
        if(audio[0].volume<0.99){
            audio[0].volume += 0.01;
        }
        volume.html('volume:' + Math.round(100*audio[0].volume) + '%');
        setTimeout(function(){volume.html('')}, 500);
    });
    $(document).bind('keydown', 'down', function(){
        if(audio[0].volume>0.01){
            audio[0].volume -= 0.01;
        }
        volume.html('volume:' + Math.round(100*audio[0].volume) + '%');
        setTimeout(function(){volume.html('')}, 500);        
    });

    $('.control-buttons').on('click', '.fa-button', function () {
        var that = $(this);

        if (that.hasClass('home-button')) {
            window.open(home);
        } else if (that.hasClass('next-button')) {
            audio[0].pause();
            loadMusic(album_ID);
        }
    });

    audio.on({
        'playing': function () {
            album.removeClass('paused');
            shade.find('.fa').removeClass('fa-play').addClass('fa-pause');
            if (lrc != " " || tlrc != " ") {
                lrc_interval = setInterval("display_lrc()", 200);
            }
        },
        'pause': function () {
            album.addClass('paused');
            shade.find('.fa').removeClass('fa-pause').addClass('fa-play');
            clearInterval(lrc_interval);
        },
        'ended': function () {
            clearInterval(lrc_interval);
        },
        'timeupdate': function () {
            elapsed.css('width', audio[0].currentTime * 100 / audio[0].duration + '%', duration=0);
        },
        'error': function () {
            // console.log(-1);
        }
    });

    shade.click(function () {
        if (audio[0].paused){
        	if (audio[0].src.search('.mp3')<0){
        		loadMusic(album_ID);
        	}
        	else{
        		audio[0].play();
        	}    
        }
        else{
            audio[0].pause();
        } 
    });

    function loadMusic(album_ID) {
        if (typeof album_ID === 'undefined') {
            album_ID = ''; 
        }
        // var audio=chrome.extension.getBackgroundPage().$('#audio');
        $.getJSON('http://kslm.oldcat.me/player.php?_=' + $.now()+'&album='+album_ID, function (data) {
        
            chrome.extension.getBackgroundPage().data_bg=data;
            chrome.extension.getBackgroundPage().has_data_bg=true;
            chrome.extension.getBackgroundPage().$('#audio').attr('src', data.mp3);
            chrome.extension.getBackgroundPage().audio[0].play();

            cover.attr({
                'src': data.cover + '?param=350y350',
                'data-src': data.cover
            });
            title.html(data.title);
            artist.html(data.artist);
            ksl_id.html(data.album);
            ksl_id.attr({
                'title' : data.ksl_id
            });

            lrc = data.lrc;
            lrc_row.html(" ");
            tlrc = data.tlrc;
            tlrc_row.html(" ");

        });
    }

    
});


    function display_lrc(){
        // var audio=chrome.extension.getBackgroundPage().$('#audio');
        var play_time = Math.floor(audio[0].currentTime*5).toString();
        lrc_row = $("#lrc");
        tlrc_row = $("#tlrc");
        lrc_row.html(lrc[play_time]);
        tlrc_row.html(tlrc[play_time]);    
    };





