import { MessageUpsertType, WAMessage, proto } from "@whiskeysockets/baileys";
import { Commands } from "../commands"

interface Response {
    msg: WAMessage,
    type: string | undefined,
    autor: [any, any],
    text: 
        |string
        |null
        |undefined,
    textSplit: string[],
    media:
        | proto.Message.IImageMessage
        | proto.Message.IVideoMessage
        | proto.Message.IStickerMessage
        | proto.Message.IVideoMessage
        | proto.Message.IImageMessage
        | proto.Message.IStickerMessage
        | undefined
        | null
    status: 
        |proto.WebMessageInfo.Status
        |null
        |undefined,
    // quoted:
    //     |proto.IMessage
    //     |null
    //     |undefined,
    isGroup: boolean | undefined,
    isCommand: boolean
}

export type messageProprietys = Response;

export const normalize = (msg: {
        messages: proto.IWebMessageInfo[];
        type: MessageUpsertType;
    }) => {
    
    let messages = msg.messages[0];
    let type: string | undefined = "null";
    let isGroup = messages.key.remoteJid?.endsWith("@g.us");

    if (messages.message) type = isGroup?Object.keys(messages.message).pop():Object.keys(messages.message)[0];

    let status = messages.status;
    let isCommand: boolean = false;
    let messageText = undefined;
    let messageInfo = undefined;
    let media = undefined
    
    if(type === "extendedTextMessage"){
        messageInfo = messages.message?.extendedTextMessage;
        messageText = messageInfo?.text;
    }else if (type === "conversation"){
        messageText = messages.message?.conversation;
    }else if(type === "imageMessage"){
        messageInfo = messages.message;
        messageText = messageInfo?.imageMessage?.caption;
        media = messageInfo?.imageMessage;
    }else if(type === "videoMessage"){
        messageInfo = messages.message;
        messageText = messageInfo?.videoMessage?.caption;
        media = messageInfo?.videoMessage;
    }

    let messageSplit: string[] | undefined = messageText?.trim().split(" ");

    if (messageSplit === undefined)messageSplit = [];
    
    if(messageText?.startsWith("~")){
        isCommand =  Commands.prototype.hasOwnProperty(messageSplit[0].slice(1));
    }

    let response: messageProprietys = {
        msg: messages,
        type: type,
        autor: [ messages.key.remoteJid, messages.pushName ],
        text: messageText,
        textSplit: messageSplit,
        media: media,
        status: status,
        isGroup: isGroup,
        isCommand: isCommand
    }

    return response;
}