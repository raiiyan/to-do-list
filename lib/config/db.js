import mongoose from "mongoose";

export const ConnectDB = async () => {
    await mongoose.connect('mongodb+srv://raiyanhossain:aG4uJuPwMkDdHk9o@cluster0.blacp.mongodb.net/todo-app');
    console.log("DB Connected");
}
