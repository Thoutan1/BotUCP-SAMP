import { createEmbed } from '#lib/createEmbed';
import { Command } from '@sapphire/framework';
import { stripIndent } from 'common-tags';
import { MessageActionRow, MessageButton } from 'discord.js';

export class UserCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
            name: "initsupport",
			description: 'ping pong',
            preconditions: ["OwnerOnly"]
		});
	}

	async messageRun(message) {
		const text = stripIndent`
            InGame Supports
            Harap Gunakan Official Ticket Tool ini dengan sebaik baiknya
            Bug Report Note:
            [-] Staff tidak menerima Report Bug Client Side
            [-] Hanya merespons Bug Server Script Side
            [-] Jika menyalah gunakan tiket, anda akan Terkena Sanksi
            Character Story Note:
            [-] Cantumkan Character Name yang Valid dengan UCP Account anda
            [-] Gunakan EYD yang benar
            [-] Minimal 4 Paragraf
            [-] Staff tidak menerima character story berupa Teks yang tidak beraturan
            [-] Story tidak berisi Dark Story
        `

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("ReportBug")
                    .setLabel("Report Bugs")
                    .setEmoji("🔨")
                    .setStyle("DANGER"),
                new MessageButton()
                    .setCustomId("CharatherStory")
                    .setLabel("Input Charather Story")
                    .setEmoji("📚")
                    .setStyle("SUCCESS")
            )

        message.channel.send({ embeds: [createEmbed("RANDOM", text).setTitle("Indolax Roleplay").setFooter({ text: "©Indolax Roleplay", iconURL: "https://cdn.discordapp.com/attachments/958674905845604392/988784499036938281/indolax_photos.jpg" })], components: [row] })
	}
}
