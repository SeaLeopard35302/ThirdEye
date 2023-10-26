export default {
    debug: false,
    token: "",
    username: "",
    isRealm: false,
    realmInviteCode: "",
    ip: "",
    port: 19132,
    guild: "",
    channel: "",
    antiCheatEnabled: true,
    antiCheatLogsChannel: "",
    cmdPrefix: "!",
    useSystemPlayerJoinMessage: false,
    logSystemCommands: false,
    systemCommandsChannel: "",
    sendWhisperMessages: false,
    useEmbed: true,
    setColor: [0, 153, 255] as const,
    setTitle: "My Servers Name!",
    AuthType: false,
    admins: [""],
    blacklistDeviceTypes: [],
    // Prefix for the command default is $ ie $voiceChannelCreate
    voiceChannelCommandPrefix: "$",
    // Category to create voice channels under.
    voiceChannelsCategory: "Voice Channels",
    //Put Your RoleID for admins to keep an eye on voice channels that get created
    voiceAdminRoleID: "",
    //Note all channels are created with a "v" in front this is used when cleaning up unused channels
};
