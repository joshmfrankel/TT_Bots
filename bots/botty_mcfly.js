
// Require TTAPI, REPL, and jQuery
var Bot = require('ttapi'), repl = require('repl'), $ = require('jquery');
var AUTH = 'tGppVzYWnfewVYXsqBLSKbFj'; //set the auth of your bot here.
var USERID = '5231e40beb35c11c0b4cfa60'; //set the userid of your bot here.
var ROOMID = '5231f2fdeb35c11c0b4cfafd';

// Init a new bot Object
var bot = new Bot(AUTH, USERID, ROOMID);

// Configuration variables
var config = {};

// Amount of bops required thumbs up a song
config.bopCount = 2;

// User list for people with admin oriented bot permissions
config.botAdmins = ['REkurzion'];
config.botAdminsId = ['5231e40beb35c11c0b4cfa60', '5127af97eb35c17b76013ddd'];

/**
 * TODOS
 *
 * 2. Create Bot Playlist
 * 3. Add song to bot playlist
 * 4. Remove song from current playlist
 * 6. Vote Skip song
 * 7. AFK Limit
 * 8. Banned Songs & Artists
 * 9. Randomize start djing message on bot step down
 * 10. Previous Song Stats
 * 11. Real time Stats (So and so likes your song)
 * 12. Song time limit
 * 13. Autodj for bot (step up to stage and step down from stage)
 * 15. Votes needed for bot like
 * 16. Can't vote multiple times for the same song
 */

//////////////////////////
// NEW USER IN THE ROOM //
//////////////////////////
// on('registered', function (data) {

//     var newUser = data.name;

//     bot.speak('Welcome @' + newUser + ' to ' + data.room.name + '.');

// });

////////////////
// BOT ENTERS //
////////////////
bot.on('roomChanged', function (data) {

    // Init the song with js obj notation
    bot.song = {};
    bot.song.songName = data.room.metadata.current_song.metadata.song;
    bot.song.album = data.room.metadata.current_song.metadata.album;
    bot.song.artist = data.room.metadata.current_song.metadata.artist;

    // Current DJ
    bot.dj = {};
    bot.dj.djName = data.room.metadata.current_song.djname;

    // Reset bop Counter
    bot.bopCount = 0;

});

//////////////////
// CURRENT SONG //
//////////////////
bot.on('newsong', function (data) {

    bot.speak(bot.dj.djName + ' just played ' + bot.song.songName + ' by ' + bot.song.artist);

    // Init the song with js obj notation
    bot.song = {};
    bot.song.songName = data.room.metadata.current_song.metadata.song;
    bot.song.album = data.room.metadata.current_song.metadata.album;
    bot.song.artist = data.room.metadata.current_song.metadata.artist;

    // Current DJ
    bot.dj = {};
    bot.dj.djName = data.room.metadata.current_song.djname;

    // Reset bop Counter
    bot.bopCount = 0;
});


/////////////////
// USER ENTERS //
/////////////////
bot.on('registered', function (data) {

    setTimeout(function() {
        bot.speak('Hey there ' + data.user[0].name + '. Welcome to Electro SYNthesis');
    }, 500);

});

//////////////////////
// Speaking methods //
//////////////////////
bot.on('speak', function (data) {

    // The content of the message
    var text = data.text;

    // The user issuing the message
    var user = data.name;

    // Does user have permission for bot commands
    var isAdmin = $.inArray(user, config.botAdmins) > -1;

    /**
     * Greeting and Salutation auto messages
     */
    if (text.match(/^\/(hello|greetings)$/)) {
        bot.speak('Hey! How are you ' + user + ' ?');
    }

    /**
     * Bop Counter
     *
     */
    if (text.match(/^\/(bop|dance|thumbsup|like)/)) {

        // No voting for your own song
        if (bot.dj.djName === user && !isAdmin) {

            setTimeout(function() {
                bot.speak(user + ', are you really that big of a narcist that you had to vote for yourself?');
            }, 500);
            setTimeout(function() {
                bot.speak('Shame on you ' + user + '. Shame on you.');
            }, 2500);

            return;
        }

        bot.bopCount++;

        // If the instance amount of bops equals the required amount
        if (bot.bopCount === config.bopCount) {
            bot.speak('Dis a nice song ' + bot.dj.djName);
            bot.vote('up');
        } else if (bot.bopCount < config.bopCount) {
            bot.speak(bot.bopCount + ' of ' + config.bopCount + ' required votes.');
        }
    }

    /**
     * BOT ADMIN COMMANDS
     *
     * User issuing command must be in the array of accepted botPermission
     */
    if (isAdmin) {

        switch(text)
        {
            // case '/go':
            //     bot.addDj();
            //     setTimeout(function() {
            //         bot.speak('Move over I\'m Djing now');
            //     }, 500);
            //     break;
            // case '/stop':
            //     bot.remDj();
            //     bot.speak('I\'m stepping why don\'t _____ start djing');
            //     break;
            // case '/skip':
            //     bot.skip();
            //     bot.speak('Thank you ' + user + '. That song is borrring.');
            //     break;
            // case '/addsong':
            //     // Bot adds song to the bottom of it's DJ queue on /addsong command
            //     bot.playlistAll(function (data) {
            //       bot.playlistAdd(songId, data.list.length);
            //     });
            //     bot.snag();
            //     break;
            // case '/empty':
            //     // Remove the current song from next queue
            //     bot.playlistAll(function (data) {
            //         bot.playlistRemove(songId, data.list.length);
            //     });
            //     break;
            // default:
            //   //bot.speak('I don\' understand the command @' + user + '.');
            //   //console.log(text)
            //   break;
        }

    }

}); // END SPEAKING METHODS



//////////////////////////
// ADMIN COMMANDS & PMs //
//////////////////////////
bot.on('pmmed', function (data) {

    // The content of the message
    var text = data.text;

    // The user issuing the message
    var user = data.userid;

    // Does user have permission for bot commands
    var isAdmin = $.inArray(user, config.botAdminsId) > -1;

    var found = '';

    // Admin check
    if (isAdmin) {

        // Anonymous message via bot
        found = text.match(/^\/(msg)(.+)$/);

        // Check for anon message
        if (found) {
            bot.speak(found[2]);
        }

        // Simple Commands
        switch(text)
        {
            case '/go':
                bot.addDj();
                setTimeout(function() {
                    bot.speak('Move over I\'m djing now');
                }, 500);
                break;
            case '/stop':
                bot.remDj();
                // Random dj name here
                bot.speak('I\'m stepping why don\'t _____ start djing');
                break;
            case '/skip':
                bot.skip();
                bot.speak('Thank you. That song was borrring.');
                break;
            case '/addsong':

                    // bot.snag();
                    // bot.playlistAdd(data.room.metadata.current_song._id);
                    // bot.becomeFan(data.room.metadata.current_dj);
                    //console.log(data.room.metadata);
                // Bot adds song to the bottom of it's DJ queue on /addsong command
                // bot.playlistAll(function (data) {
                //   bot.playlistAdd(songId, data.list.length);
                // });
                // bot.snag();
                break;
            case '/remove':
                // Remove the current song from next queue
                bot.playlistAll(function (data) {
                    bot.playlistRemove(songId, data.list.length);
                });
                break;
            default:
              //bot.speak('I don\' understand the command @' + user + '.');
              //console.log(text)
              break;
        }

    }

});
