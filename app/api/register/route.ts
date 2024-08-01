import User from '../../models/User';
import connect from '../../../utils/db';
import bcrypt from "bcryptjs";

import {NextResponse} from 'next/server';

export const POST = async (request:any) => {
    const { email, password } = await request.json();

    await connect();
    const exisitingUser = await User.findOne({ email });
    if(exisitingUser) {
        return new NextResponse('User already exists', {
            status: 400,
        });
    }
const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({
        email,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        return new NextResponse('User created', {
            status: 201,
        });

    } catch (err:any) {
        return new NextResponse(err,{
            status: 500,
        });
    }
}