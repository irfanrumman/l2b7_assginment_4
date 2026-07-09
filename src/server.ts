import app from "./app"
import { prisma } from "./lib/prisma";
import config from "./config";

const PORT = config.port;
async function main(){
    try {
        await prisma.$connect();
        console.log("DB Successfully Connectede.");
        app.listen(PORT, ()=>{
            console.log(`The Server Is Running On Port ${PORT}`)
        })
    } catch (error) {
        console.error("Error Starting Server:", error);
        await prisma.$disconnect()
        process.exit(1);
    }
}
main()