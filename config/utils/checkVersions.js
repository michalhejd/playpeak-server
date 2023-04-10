import { config } from "dotenv"
config()

export async function checkVerisons(){
    if(parseInt(process.versions.node.split(".")[0]) < 16){
        console.log("Node version is too old, please update to 16.0.0 or higher")
        return process.exit(0)
    }
}