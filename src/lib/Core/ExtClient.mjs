import { LogLevel, SapphireClient } from "@sapphire/framework";
import config from '#rootJson/config' assert {type: "json"};

export class ExtClient extends SapphireClient {
    constructor() {
        super({
            defaultPrefix: config.prefix,
            regexPrefix: /^(hey +)?bot[,! ]/i,
            caseInsensitivePrefixes: true,
            caseInsensitiveCommands: true,
            intents: [
                'GUILDS',
                'GUILD_MEMBERS',
                'GUILD_BANS',
                'GUILD_EMOJIS_AND_STICKERS',
                'GUILD_VOICE_STATES',
                'GUILD_MESSAGES',
                'GUILD_MESSAGE_REACTIONS',
                'DIRECT_MESSAGES',
                'DIRECT_MESSAGE_REACTIONS'
            ],
            shards: 'auto',
            logger: {
                level: LogLevel.Debug
            }
        })
    }
    async initBot() {
        await this.login(config.discord_token);
        this.logger.info("Logged In");
    }
}