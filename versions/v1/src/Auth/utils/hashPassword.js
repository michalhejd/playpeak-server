import bcrypt from 'bcrypt';

export default async function hashPassword(password) {
    // generate salt
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    // hash password and return hashed password
    return bcrypt.hash(password, salt);
}