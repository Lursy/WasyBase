import { connectToWhatsApp, WASocket } from "./tools/connection"
import { messageProprietys, normalize } from "./tools/normalize";
import { Commands } from "./commands"


async function main(){
    const sock: WASocket = await connectToWhatsApp();
    
    sock.ev.on('messages.upsert', async msg => {
        if(msg.messages[0].key.remoteJid === "status@broadcast") return;
        
        let message: messageProprietys | undefined = normalize(msg);
        // console.log(JSON.stringify(msg, undefined, 2));
        console.log(message);
        
        if(message){
            if (message.isCommand){
                const commands = new Commands(sock, message);
                commands.callFunc(message.textSplit[0].slice(1), message.textSplit.slice(1))
            }
        }
    })
}

main()