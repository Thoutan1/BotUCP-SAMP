import { MessageEmbed } from "discord.js"

const hexColors = Object.freeze({
    error: "RED",
    info: "BLURPLE",
    success: "GREEN",
    warn: "YELLOW",
    random: "RANDOM"
})

export function createEmbed(type, message) {
    const embed = new MessageEmbed()
        .setColor(hexColors[type]);

    if(message) embed.setDescription(message);
    return embed;
}