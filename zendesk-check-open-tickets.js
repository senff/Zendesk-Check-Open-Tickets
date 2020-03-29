// ==UserScript==
// @name         Zendesk Check Open Tickets
// @namespace    http://tampermonkey.net/
// @version      0.97 rev. 230676
// @description  Checks if this user has OPEN/PENDING/ON-HOLD/NEW tickets and will display a notification at the top if they do
// @author       Senff
// @updateURL    https://github.com/senff/Zendesk-markdown-buttons/raw/master/zendesk-markdown-buttons.user.js
// @match        https://*.zdusercontent.com/*
// @grant        none
// ==/UserScript==

var $ = window.jQuery;

function checkTickets() {
    var nudgeNudge;
    var winkWink = 0;
    var goThruTix = setInterval(function() {
        if($('body').hasClass('saynoMORE')) {
            clearInterval(goThruTix);
        } else {
            if($('.type-Zendesk_History').length) {
                var mainURL = (window.location != window.parent.location)
                ? document.referrer
                : document.location.href;
                var URLdivider = mainURL.split('/');
                var thisTicket = URLdivider.pop();
                var thisUser = $('.user__info .user__info-row:first-child .value').text();
                $('#support__history-content .type-Zendesk_History').each(function(ticket) { // Looping through this user's list of tickets
                    var ticketLine = $(this).find('.subject a').html();
                    var ticketNoLong = ticketLine.substring(ticketLine.indexOf("#") + 1); // Remove first character
                    var ticketNo = ticketNoLong.substring(0, ticketNoLong.indexOf(' - ')); // Remove everything after first space
                    if(ticketNo!=thisTicket) {
                        // This entry is not the ticket we're looking at
                        if(($(this).hasClass('status-Open')) || ($(this).hasClass('status-Pending')) || ($(this).hasClass('status-Hold')) || ($(this).hasClass('status-New'))) { // There's other tickets, aside from this one
                            winkWink = winkWink + 1;
                        }
                    } else {
                        $(this).addClass('this-ticket');
                    }
                });
                if(winkWink > 0) {
                    $('body').addClass('saynoMORE');
                    nudgeNudge = "<div class='nudgeNudge'><span style='font-size:18px;'>⚠️</span> <span class='whatsItLike'><strong>THIS USER HAS OTHER OPEN/PENDING TICKETS!</strong> Please check those first before you reply here.</span>&nbsp;&nbsp;&nbsp;<a href='#'>Cool, got it.</a></strong></div>";
                    $(nudgeNudge).prependTo('body');
                    var nudgeHeight = $('.nudgeNudge').outerHeight()+5;
                    $('body').css('padding-top',nudgeHeight+'px');
                    blinkieBlink();
                }
                $('body').addClass('saynoMORE');
            }
        }

    }, 1000);
}

function blinkieBlink() {
    setInterval(function(){
    $('.nudgeNudge .whatsItLike').toggleClass('hidethis');
  }, 800);
}

$('body').on('click','.nudgeNudge a',function(){
    $('.nudgeNudge a').html('Baiiiiiiiiii');
    $('.nudgeNudge').fadeOut(500);
    $('body').removeClass('saynoMORE').animate({padding: 0}, 800, function() {});
});

$(document).ready(function() {
    $('body').append('<style type="text/css" id="nudgestyles">.nudgeNudge{box-sizing:border-box; position: fixed; width: 100%; top:0; z-index: 100; background: #aa0000; color: #ffffff; padding: 7px 10px 10px; line-height: 20px;}.nudgeNudge a {color: #FFFFCC;font-weight: bold; text-decoration:underline;}.hidethis{opacity:0;}.this-ticket td{background: #e7e7e7 !important;filter: grayscale(100%);}.this-ticket td:first-child {border-left: solid 1px #cccccc;}.this-ticket td.subject a,.this-ticket td.when {cursor: default;pointer-events: none;color: #888888 !important;text-shadow: 1px 1px 0 #ffffff;font-style: italic;font-size: 12px;}</style>');
    checkTickets();
});
