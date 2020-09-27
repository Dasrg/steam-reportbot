const steamCommunity = require('steamcommunity');
const steamTotp = require('steam-totp');
const colors = require('colors');
const path = require("path");
var async = require('async');
var fs = require("fs");
let config = null;

var community = new steamCommunity();
var text = fs.readFileSync("./bots.txt").toString('utf-8');
var bot = text.split("\n")
config = require(path.resolve("config.json"));
let configRaw = fs.readFileSync("./config.json").toString();
const id = config.id;
const perChunk = config.perChunk;
const betweenChunks = config.betweenChunks;
const limited = config.limited;
console.log('%s is steamID'.gray, id);

var allSuccess = 0;
var allFailed = 0;


(async() => {
	// Getting chunks:
    let subbot = []; 
	if (config.count != 0) bot.length = config.count;
	for (let i = 0; i <Math.ceil(bot.length/perChunk); i++){
		subbot[i] = bot.slice((i*perChunk), (i*perChunk) + perChunk);
	}
	
	console.log('Total %s accounts and %s chunks'.cyan, bot.length, subbot.length);
	if (config.limited == true) console.log('You set LIMITED accounts. Use this format in the BOTS.TXT:'.black.bgWhite + '"login:password:"'.blue.bgWhite+'(with the colon in the end of lines)'.black.bgWhite);
	for (let ii = 0; ii < subbot.length; ii++) {
		
		var success = 0;
		var failed = 0;	

		async.each(subbot[ii], function(item, callback){
				// Splitting each line to login, password, shared_secret:
				if (!limited) {
					const logOnOptions = {
						accountName: item.split(":")[0],
						password: item.split(":")[1],
						twoFactorCode: steamTotp.generateAuthCode(item.split(":")[2]),
					};  

					community.login({
						"accountName": logOnOptions.accountName,
						"password": logOnOptions.password,
						"twoFactorCode": logOnOptions.twoFactorCode
						},
						function (err, sessionID, cookies, steamguard, oAuthToken) {
							if (err) { console.log('[%s] Unable to auth (Error: %s)'.red, logOnOptions.accountName, err); failed++; allFailed++; callback(); }
							if (!err) {
								(async() => {
													
								console.log('[%s] Successfully logged on (Session ID: %s)'.yellow, logOnOptions.accountName, sessionID);
								var options = {
									formData: {	sessionid: sessionID, json: 1, abuseID: config.id, eAbuseType: 10, abuseDescription: 'Cheating in the recent matches.', ingameAppID: config.appid },
									headers: { Cookie: cookies, Host: 'steamcommunity.com', Origin: 'https://steamcommunity.com' },
									json: true
								};
											
									community.httpRequestPost(
										'https://steamcommunity.com/actions/ReportAbuse/', options,
										function (err, res, data) {
											if (err) {
												console.log('err', err); failed++; allFailed++;
											}
											if (!err) {
											 if (data == 1) { console.log('[%s] Successfully reported with response code %s'.green, logOnOptions.accountName, data); success++; allSuccess++;}
											 else if (data == 25) { console.log('[%s] Already reported. Response code %s'.red, logOnOptions.accountName, data); failed++; allFailed++; }
											 else { console.log('[%s] something went wrong. Response code %s'.red, logOnOptions.accountName, data); failed++; allFailed++;}
											callback();
											}
										},
										"steamcommunity"
									);
								
								
								})();
							}
					});
				};	
				if (limited) {
					const logOnOptions = {
						accountName: item.split(":")[0],
						password: item.split(":")[1]		
					};  

					community.login({
						"accountName": logOnOptions.accountName,
						"password": logOnOptions.password
						},
						function (err, sessionID, cookies, steamguard, oAuthToken) {
							if (err) { console.log('[%s] Unable to auth (Error: %s)'.red, logOnOptions.accountName, err); failed++; allFailed++; callback(); }
							if (!err) {
								(async() => {
													
								console.log('[%s] Successfully logged on (Session ID: %s)'.yellow, logOnOptions.accountName, sessionID);
								var options = {
									formData: {	sessionid: sessionID, json: 1, abuseID: config.id, eAbuseType: 10, abuseDescription: 'Cheating in the recent matches.', ingameAppID: config.appid },
									headers: { Cookie: cookies, Host: 'steamcommunity.com', Origin: 'https://steamcommunity.com' },
									json: true
								};
											
									community.httpRequestPost(
										'https://steamcommunity.com/actions/ReportAbuse/', options,
										function (err, res, data) {
											if (err) {
												console.log('err', err); failed++; allFailed++;
											}
											if (!err) {
											 if (data == 1) { console.log('[%s] Successfully reported with response code %s'.green, logOnOptions.accountName, data); success++; allSuccess++;}
											 else if (data == 25) { console.log('[%s] Already reported. Response code %s'.red, logOnOptions.accountName, data); failed++; allFailed++; }
											 else { console.log('[%s] something went wrong. Response code %s'.red, logOnOptions.accountName, data); failed++; allFailed++;}
											callback();
											}
										},
										"steamcommunity"
									);
								
								
								})();
							}
					});
				};				
		}, function(err) {
				console.log('Chunk %s finished: Successfully reported %s times and %s failed requests'.white, ii + 1, success, failed);
				if (ii < subbot.length - 1) console.log('Waiting %s ms for the next chunk'.cyan, betweenChunks);
		});
		if (ii < subbot.length) await new Promise(r => setTimeout(r, betweenChunks));
	};
    console.log('Successfully reported %s times and %s failed requests.'.black.bgWhite, allSuccess, allFailed)
	
	
})();