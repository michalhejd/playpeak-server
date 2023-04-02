export async function checkEnvironments(){
    let missingEnvironments = []

    if(!process.env.PORT){
        missingEnvironments.push("PORT")
    }
    if(!process.env.NODE_ENV){
        missingEnvironments.push("NODE_ENV")
    }
    if(!process.env.DB){
        missingEnvironments.push("DB")
    }
    if(!process.env.JWT){
        missingEnvironments.push("JWT")
    }
    if(!process.env.SALT_ROUNDS){
        missingEnvironments.push("SALT_ROUNDS")
    }
    if(!process.env.ADMIN_EMAIL){
        missingEnvironments.push("ADMIN_EMAIL")
    }
    if(missingEnvironments.length > 0){
        console.log("Missing environments: " + missingEnvironments.join(", "))
        return process.exit(0)
    }
    return
}