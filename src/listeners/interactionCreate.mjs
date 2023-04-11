import { Listener } from '@sapphire/framework';
import { Connection } from '#lib/Core/Mysql';
import config from '#rootJson/config' assert {type: "json"};
import { MessageActionRow, Modal, TextInputComponent } from 'discord.js';
import { createEmbed } from '#lib/createEmbed';
import URL from 'url';
const talkedRecently = new Set();

export class UserEvent extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            name: "interactionCreate"
        });
    }

    async run(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId === "ButtonRegister") {
                const x = Date.now() - interaction.user.createdAt;
                const created = Math.floor(x / 86400000);

                if (created < 30) return;
                Connection.query(`SELECT * FROM playerucp WHERE DiscordID = '${interaction.user.id}'`, async function (err, row) {
                    if (row.length < 1) {
                        const modal = new Modal()
                            .setCustomId("ModalRegister")
                            .setTitle("Register bapak kau Roleplay")

                        const NickNameInput = new TextInputComponent()
                            .setCustomId('NickNameInput')
                            .setMinLength(3)
                            .setMaxLength(100)
                            .setPlaceholder("Input your Valid nickname here")
                            .setLabel("Input your ucp name is box below.")
                            .setStyle('SHORT');

                        const packedModal = new MessageActionRow().addComponents(NickNameInput);
                        // @ts-ignore
                        modal.addComponents(packedModal)

                        interaction.showModal(modal);
                    } else {
                        return interaction.reply({ content: `You have been Registered before use **Reverif Button instead**`, ephemeral: true })
                    }
                })
            }
            if (interaction.customId === "Reverif") {
                Connection.query(`SELECT * FROM playerucp WHERE DiscordID = '${interaction.user.id}'`, async function(err, row) {
                    if(row.length < 1) {
                        return;
                    } else {
                        const member = interaction.member;
                        member.roles.add(config.MemberRole);
                        member.setNickname(`${row[0].UCP}`);
                    }
                })
            }
            if (interaction.customId === "ReportBug") {
                if(talkedRecently.has(interaction.user.id)) return interaction.reply({ content: `:x: You must wait 20 minute to report bug again`, ephemeral: true })
                const modal = new Modal()
                        .setCustomId("ModalReportBug")
                        .setTitle("Report bugs bapak kau Roleplay")

                    const TitleInput = new TextInputComponent()
                        .setCustomId('Title')
                        .setMinLength(4)
                        .setMaxLength(16)
                        .setPlaceholder("Input your Bug Title")
                        .setLabel("BUG TITLE/SUBJECT")
                        .setStyle('PARAGRAPH');
                    
                    const DescriptionInput = new TextInputComponent()
                        .setCustomId('Desc')
                        .setMinLength(4)
                        .setMaxLength(128)
                        .setPlaceholder("Input your Bug Description ")
                        .setLabel("BUG DESCRIPTION")
                        .setStyle('PARAGRAPH');
                    
                    const LinkInput = new TextInputComponent()
                        .setCustomId('Link')
                        .setMinLength(4)
                        .setMaxLength(64)
                        .setPlaceholder("Input your valid Video/Image reported Bugs link ")
                        .setLabel("IMAGE/VIDEO LINK")
                        .setStyle('PARAGRAPH');
                            
                    const packedModal = new MessageActionRow().addComponents(TitleInput);
                    const packedModal2 = new MessageActionRow().addComponents(DescriptionInput)
                    const packedModal3 = new MessageActionRow().addComponents(LinkInput)
                    // @ts-ignore
                    modal.addComponents(packedModal)
                    // @ts-ignore
                    modal.addComponents(packedModal2)
                    // @ts-ignore
                    modal.addComponents(packedModal3)

                    interaction.showModal(modal);
            }
            if (interaction.customId === "CharatherStory") {
                interaction.reply({ content: "Coming soon", ephemeral: true })
            }
        }
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'ModalReportBug') {
                const Title = interaction.fields.getTextInputValue("Title");
                const desc = interaction.fields.getTextInputValue("Desc");
                const link = interaction.fields.getTextInputValue("Link");
                
                if(stringIsAValidUrl(link)) {
                    const channel = interaction.guild.channels.cache.find(ch => ch.id === config.AdminReportedBugs);
                    channel.send({ embeds: [createEmbed("error", "").setTitle("bapak kau Roleplay reported bugs").addField("Title", `> ${Title}`).addField("Description", `> ${desc}`).setAuthor({ name: "bapak kau Support", iconURL: "https://cdn.discordapp.com/attachments/958674905845604392/988784499036938281/bapak kau_photos.jpg" }).setImage(link || "https://cdn.discordapp.com/attachments/956839460602015758/988805787893780500/No_image_icon___.png").setFooter({ text: `This bugs reported from discord user: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ format: "png", dynamic: true }) })] })
                    interaction.reply({ content: ":white_check_mark: Bugs has been successfully reported to admin!", ephemeral: true  })
                    talkedRecently.add(interaction.user.id);
                    setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(interaction.user.id);
                    }, 1200000);
                } else {
                    interaction.reply({ content: "Please Input valid image url", ephemeral: true })
                }
            }
            if (interaction.customId === 'ModalRegister') {
                const nickNameInput = interaction.fields.getTextInputValue("NickNameInput");
                Connection.query(`SELECT * FROM playerucp WHERE ucp = '${nickNameInput}' LIMIT 1`, async function (err, row) {
                    if (row.length < 1) {
                        if (hasWhiteSpace(nickNameInput)) {
                            return interaction.reply({ content: ':x: Your **UCP Name** cannot contains space!', ephemeral: true });
                        }
                        if (nickNameInput.length < 3) {
                            return interaction.reply({ content: ":x: Invalid **UCP Name** Length!", ephemeral: true });
                        }
                        if (/[~`!@#$%^&*()+={}\[\];:\'\"<>,\/\\\-]/g.test(nickNameInput)) {
                            return interaction.reply({ content: ":x: You cannot use special characters in your **UCP Name**", ephemeral: true })
                        }

                        const code = getRandomInt(23514, 99899);
                        try {
                            SendDm(interaction, nickNameInput, code);
                        } catch {
                            return interaction.reply({ content: ':cry: Oh No something error, please contact staff for help.', ephemeral: true })
                        }
                    } else {
                        return interaction.reply({ content: `:x: The **UCP Name** **${nickNameInput}** have been registered before use another **UCP Name**`, ephemeral: true })
                    }
                })
            }
        }
    }
}

async function SendDm(interaction, name, code) {
    const member = interaction.member;
    await Connection.query(`INSERT INTO playerucp SET ucp = '${name}', DiscordID = '${interaction.user.id}', verifycode = '${code}'`);
    await member.roles.add(config.MemberRole);
    await member.setNickname(name);
    await interaction.user.send({ embeds: [createEmbed("SUCCESS", `> **Hallo ${interaction.user.username}**\n> **Gunakanlah PIN Di bawah ini untuk login ke Game**`).addField("UCP", `> **${name}**`).addField("PIN", `> ||${code}||\n\n__Klik kotak hitam untuk melihat pin kamu!__`).setThumbnail("https://cdn.discordapp.com/attachments/958674905845604392/988784499036938281/bapak kau_photos.jpg").setTimestamp().setFooter({ text: "©bapak kau Roleplay", iconURL: "https://cdn.discordapp.com/attachments/958674905845604392/988784499036938281/bapak kau_photos.jpg" })] });
    await interaction.reply({ content: `:white_check_mark: UCP **${name}** Successfully Registered, please check your **Direct Message** for your verification code`, ephemeral: true })
}

function Minsteps(n, m) {
    let ans = 0;

    while (m > n) {
        if (m & 1) {
            m++;
            ans++;
        }

        m = Math.floor(m / 2);
        ans++;
    }

    return ans + n - m;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function hasWhiteSpace(s) {
    const whitespaceChars = [' ', '\t', '\n'];
    return whitespaceChars.some((char) => s.includes(char));
}

const stringIsAValidUrl = (s) => {
    try {
      new URL.URL(s);
      return true;
    } catch (err) {
      return false;
    }
  };