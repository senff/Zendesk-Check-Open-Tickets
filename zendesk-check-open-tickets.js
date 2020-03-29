// ==UserScript==
// @name         Zendesk Check Open Tickets
// @namespace    http://tampermonkey.net/
// @version      0.91 rev 230676
// @description  Checks if this user has OPEN/PENDING/NEW tickets and will display a notification at the top if they do
// @author       Senff
// @updateURL    https://github.com/senff/Zendesk-Check-Open-Tickets/raw/master/zendesk-check-open-tickets.user.js
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
                $('#support__history-content .type-Zendesk_History').each(function(ticket) {
                    var thisUserBox = $(this);
                    if(($(this).hasClass('status-Open')) || ($(this).hasClass('status-Pending')) || ($(this).hasClass('status-New'))) {
                        var ticketLine = $(this).find('.subject a').html();
                        // Remove first character
                        var ticketNoLong = ticketLine.substring(ticketLine.indexOf("#") + 1);
                        // Remove everything after first space
                        var ticketNo = ticketNoLong.substring(0, ticketNoLong.indexOf(' - '));
                        if(ticketNo!=thisTicket) {
                            // There's other tickets, aside from this one
                            winkWink = winkWink + 1;
                        }
                    }
                });
                if(winkWink > 0) {
                    $('body').append('<style type="text/css" id="nudgestyles">.nudgeNudge{box-sizing:border-box; position: fixed; width: 100%; top:0; z-index: 100; background: #aa0000; color: #ffffff; padding: 7px 10px 10px; line-height: 20px;}.nudgeNudge a {color: #FFFFCC;font-weight: bold; text-decoration:underline;}.hidethis{opacity:0;}</style>').addClass('saynoMORE');
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
    $('.nudgeNudge').remove();
    $('body').css('padding-top',0).removeClass('saynoMORE');
});

$(document).ready(function() {
    checkTickets();
});
