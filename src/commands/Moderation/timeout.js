const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Untimes out a server member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to untimeout")
        .setRequired(true)
    )
    .addStringOption(option => option.setName('reason').setDescription('The reason for untiming user out')),
    async execute (interaction){

        const timeUser = interaction.options.getUser('user');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({content: `You must have Permissions to moderate members`, ephemeral: true});
        if (!timeMember) return await interaction.reply({content: `The user mentiont is no longer there`, ephemeral: true});
        if (!timeMember.kickable) return await interaction.reply({content: `I can not untimout this user`, ephemeral: true});
        if (interaction.member.id === timeMember.id) return await interaction.reply({content: `You cannot untimeout yourself`, ephemeral: true});
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({content: `You cannot untimeout this person`, ephemeral: true});
        
        let reason = interaction.options.getString('reason') || 'No reason given';

        await timeMember.timeout(null);
        const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(`:white_check_mark:  ${timeUser.tag} timeout has been **removed** | ${reason}`)

        const dmEmbed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(`:white_check_mark:  You have been **untimed out** in ${interaction.guild.name}.  | ${reason}`)

        await timeMember.send({embeds: [dmEmbed]}).catch(err =>{
            return;
        })
    
        await interaction.reply({embeds:[embed]});
    
    }
};
