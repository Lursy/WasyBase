import { WASocket } from "./tools/connection";
import { messageProprietys } from "./tools/normalize";


export class Commands {
    sock: WASocket
    message: messageProprietys 

    constructor(sock: WASocket, message: messageProprietys){
        this.sock = sock;
        this.message = message;
    }

    async ping(){
        let startTime = Date.now();
        let pong = await this.sock.sendMessage(this.message.autor[0], {text: "Pong"});
        let latency = Date.now() - startTime;
        this.sock.sendMessage(this.message.autor[0], {edit: pong?.key, text: `Pong\nLatência: ${latency}ms`});
    }

    // async calc(x:string, sinal: string, y:string){
    //     this.sock.sendMessage(this.message.autor[0], {text: String(eval(x + sinal + y))})
    // }

    [func: string]: any
    callFunc = (func: string, args: string[] | undefined) => {
        if(args){
            this[func](...args);
        }else{
            this[func]();
        }
    }
}