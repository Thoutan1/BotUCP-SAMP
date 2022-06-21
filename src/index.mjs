import '#lib/setup';
import { ExtClient } from '#lib/Core/ExtClient';
import samp from 'samp-query'
import config from '#rootJson/config' assert {type: "json"};
const client = new ExtClient();

client.initBot();

//Extends Event
client.on("ready", () => {
    console.log("Updated Status!")
    UpdateStatus();setInterval(UpdateStatus,10000)
})

function UpdateStatus() {
    const Options = {
        host: config.Server_Ip,
        port: config.Server_Port
    }
    let status;
    samp(Options, function(error, response) {
        if(error)
        {
            status = "Unknown Players";
            client.user.setActivity(status, { type: "WATCHING" });
        } else {
            status = `${response['online']}/${response['maxplayers']} Players!`;
            client.user.setActivity(status, {type: "WATCHING" });
        }
    })

}