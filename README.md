# steam-reportbot
Gives reports in the steam profile with steamID and appID

[![GitHub followers](https://img.shields.io/github/followers/Dasrg?label=Follow&style=social)](https://github.com/Dasrg)
[![streamlabs](https://img.shields.io/badge/Donate-%241-red)](https://streamlabs.com/das-Dme6dF/tip)
[![nodejs](https://img.shields.io/badge/node.js-v12-brightgreen)](https://nodejs.org/)

<b>Installing:</b>
1. Install <a href="https://nodejs.org/">Node.js LTS version</a>
2. Download this repo (click `Code -> Download ZIP`) and unpack the archive.
3. Open command prompt or PowerShell in the bot folder (`Shift + Right Click`, or `cd 'path to the bot'`)
4. Type `npm i` or `npm install`

<b>Using:</b>
1. Add to the `bots.txt` textfile accounts login data (`login:password:shared_secret` in the each line). If you want to use limited accounts (without $5 spent) use this formatting: `login:password:`.
2. In the `config.json` set steam id of needed player. You can get this in this site: https://steamdb.info/calculator/. Just put the link of needed steam profile.
3. Enter the `appid` parameter. For CSGO its 730.
4. Set the `perChunk` and `betweenChunks` parameters (stock values suitable for you).
5. If you want to use limited steam acconts enter this: `"limited": true`. If you want to use unlimited (with $5) type this: `"limited": false`.
6. Run the bot - type in the command prompt or PowerShell: `node index.js` or just `node index`
