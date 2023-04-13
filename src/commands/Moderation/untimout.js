const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("timeout")
      .setDescription("Times out a server member")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user you want to time out")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("duration")
          .setDescription("Duration of the timeout")
          .setRequired(true)
          .addChoices(
            { name: "60 sec", value: "60" },
            { name: "2 mins", value: "120" },
            { name: "5 mins", value: "300" },
            { name: "10 mins", value: "600" }
          )
      )
      .addStringOption(option => option.setName('reason').setDescription('The reason for timing user out')),
      async execute (interaction){
  
          const timeUser = interaction.options.getUser('user');
          const timeMember = await interaction.guild.members.fetch(timeUser.id);
          const duration = interaction.options.getString('duration');
  
          if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({content: `You must have Permissions to moderate members`, ephemeral: true});
          if (!timeMember) return await interaction.reply({content: `The user mentiont is no longer there`, ephemeral: true});
          if (!timeMember.kickable) return await interaction.reply({content: `I can not timout this user`, ephemeral: true});
          if (interaction.member.id === timeMember.id) return await interaction.reply({content: `You cannot timeout yourself`, ephemeral: true});
          if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({content: `You cannot timeout this person`, ephemeral: true});
          
          let reason = interaction.options.getString('reason') || 'No reason given';
  
          await timeMember.timeout(duration * 1000, reason);
          const embed = new EmbedBuilder()
          .setColor('Green')
          .setDescription(`:white_check_mark:  ${timeUser.tag} has been **timed out** for ${duration / 60}  minute(s) | ${reason}`)
  
          const dmEmbed = new EmbedBuilder()
          .setColor('Green')
          .setDescription(`:white_check_mark:  You have been timed out in ${interaction.guild.name}. You can check the status of your timeout within the server | ${reason}`)
  
          await timeMember.send({embeds: [dmEmbed]}).catch(err =>{
              return;
          })
      
          await interaction.reply({embeds:[embed]});
      
      }
  };
  