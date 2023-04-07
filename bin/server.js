import app from "../app.js"
import {config} from "dotenv"
import { checkEnvironments } from "../config/utils/checkEnvironments.js";
import { defaultRoot } from "../config/utils/createDefaultRootUser.js";
config()

process.on('warning', e => console.warn(e.stack));

checkEnvironments()
await defaultRoot()

app.listen(process.env.PORT || 3000, () => {
    if (process.env.NODE_ENV == 'development')
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    else
        console.log(`Server is running`);
});