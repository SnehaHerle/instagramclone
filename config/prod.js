/*
1. Copy the URL from Atlas in the Connect section.
2. Paste it here and add the password for the Atlas username along with it.
3. This is now used to connect to MongoDB through Atlas (Database as Service).
*/

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGOURI: process.env.MONGOURI
}