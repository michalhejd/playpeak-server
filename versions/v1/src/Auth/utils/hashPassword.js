import bcrypt from 'bcrypt';

export default async function hashPassword(password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    return bcrypt.hash(password, salt);
}