import { EmbedBuilder, TextBasedChannel } from "discord.js";
import config from "../config.js";
import { Client } from "bedrock-protocol";

const excludedPackets: string[] = ["commands.tp.successVictim", "gameMode.changed", "commands.give.successRecipient"];

function handleTextEvent(packet: any, systemCommandsChannelId: TextBasedChannel) {
    const { rawtext } = JSON.parse(packet.message);

    if (excludedPackets.some((excludedPacket) => packet.message.includes(excludedPacket))) {
        return; // Exclude this packet
    }

    const playerName = rawtext?.[1]?.translate || "Server";
    const rawtextArray: { text: string }[] = rawtext?.[3]?.with?.rawtext || [];
    const results = rawtextArray.map((item) => item.text).filter(Boolean);
    let systemMessage = results.join(" ");

    let successMessage = rawtext?.[3]?.translate || "";
    let dontSendMessage = false;

    switch (successMessage) {
        case "commands.time.set":
            successMessage = "set time";
            break;
        case "commands.gamemode.success.self":
            successMessage = "Set their gamemode ";
            systemMessage = getGamemodeText(results[0]);
            break;
        case "commands.gamemode.success.other":
            successMessage = `Has Set ${results[1]} gamemode `;
            systemMessage = getGamemodeText(results[0]);
            break;
        case "commands.weather.clear":
            systemMessage = "Clear";
            successMessage = "Set the weather to ";
            break;
        case "commands.weather.rain":
            systemMessage = "Rain";
            successMessage = "Set the weather to ";
            break;
        case "commands.weather.thunder":
            systemMessage = "Thunder";
            successMessage = "Set the weather to ";
            break;
        case "commands.difficulty.success":
            successMessage = "Set the world's difficulty to ";
            systemMessage = getDifficultyText(systemMessage);
            break;
        case "commands.setworldspawn.success":
            successMessage = "Set world spawn to: ";
            systemMessage = `X: ${results[0]} Y: ${results[1]} Z: ${results[2]}`;
            break;
        case "commands.tp.success":
            successMessage = " has teleported: ";
            systemMessage = `${results[0]} to: ${results[1]}`;
            break;
        case "commands.give.success":
            successMessage = "Has given: ";
            systemMessage = `${results[2]} item: ${results[0]}, amount: ${results[1]}`;
            break;
        case "commands.enchant.success":
            successMessage = " Has enchanted an item for: ";
            systemMessage = results[0];
            break;
        case "commands.clear.success":
            successMessage = `Has cleared: ${results[0]} inventory removing a total of: `;
            systemMessage = `${results[1]} items`;
            break;
        case "commands.effect.success":
            successMessage = `has given an effect to ${results[2]}`;
            systemMessage = `effect type: ${getPotionResult(results[0])} duration: ${results[3]} multiplier: ${results[1]}`;
            break;
        default:
            dontSendMessage = true;
    }

    if (!dontSendMessage) {
        const message = `[System Message] ${playerName} ${successMessage} ${systemMessage}`;
        if (config.useEmbed) {
            const msgEmbed = new EmbedBuilder().setColor(config.setColor).setTitle(config.setTitle).setDescription(message).setAuthor({ name: "‎", iconURL: "https://i.imgur.com/FA3I1uu.png" });

            if (typeof systemCommandsChannelId === "object") {
                systemCommandsChannelId.send({ embeds: [msgEmbed] });
            } else {
                console.log("I could not find the systemCommands channel in Discord. 1");
            }
        } else {
            if (typeof systemCommandsChannelId === "object") {
                systemCommandsChannelId.send(message);
            } else {
                console.log("I could not find the systemCommands channel in Discord. 2");
            }
        }
    }
}

function getGamemodeText(gamemode: string): string {
    switch (gamemode) {
        case "%createWorldScreen.gameMode.creative":
            return "to Creative";
        case "%createWorldScreen.gameMode.survival":
            return "to Survival";
        case "%createWorldScreen.gameMode.adventure":
            return "to Adventure";
        case "%createWorldScreen.gameMode.spectator":
            return "to Spectator";
        default:
            return "";
    }
}

function getDifficultyText(difficulty: string): string {
    switch (difficulty) {
        case "PEACEFUL":
            return "Peaceful";
        case "EASY":
            return "Easy";
        case "NORMAL":
            return "Normal";
        case "HARD":
            return "Hard";
        default:
            return "";
    }
}

function getPotionResult(result: string): string {
    return result.replace(/%potion|\./g, "");
}

export function setupSystemCommandsListener(bot: Client, systemCommandsChannelId: TextBasedChannel) {
    bot.on("text", (packet) => handleTextEvent(packet, systemCommandsChannelId));
}
