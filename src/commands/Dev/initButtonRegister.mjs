import { createEmbed } from '#lib/createEmbed';
import { Command } from '@sapphire/framework';
import { stripIndent } from 'common-tags';
import { MessageActionRow, MessageButton } from 'discord.js';

export class UserCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
            name: "initregister",
			description: 'ping pong',
            preconditions: ["OwnerOnly"]
		});
	}

	async messageRun(message) {
		const text = stripIndent`
            Harap Gunakan Official Ticket Tool ini dengan sebaik baiknya
            Registration Note:
            [-] Dibutuhkan Akun Discord yang sudah aktif Minimal 30 hari
            [-] Harap Masukkan Nama UCP yang Valid! (Bukan Nama Roleplay)
            [-] Jika menyalah gunakan tiket, anda akan Terkena Sanksi
        `

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("ButtonRegister")
                    .setLabel("Register")
                    .setEmoji("✅")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("Reverif")
                    .setLabel("Reverif")
                    .setEmoji("🔗")
                    .setStyle("SECONDARY")
            )

        message.channel.send({ embeds: [createEmbed("RANDOM", text).setTitle("Indolax Roleplay").setFooter({ text: "©Indolax Roleplay", iconURL: "https://cdn.discordapp.com/attachments/958674905845604392/988784499036938281/indolax_photos.jpg" })], components: [row] })
	}
}
