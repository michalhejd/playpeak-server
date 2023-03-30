import app from "../app.js"
import {config} from "dotenv"
config()


app.listen(process.env.PORT || 3000, () => {
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV == 'development')
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    else
        console.log(`Server is running`);
});