import Project from '../../models/Project';
import connect from '../../../utils/db';

import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req:any) {
  const { projecttitle,ProjectDescription, GitHubLink, YoutubeLink } = await req.json();

  try {
    await connect();
    await Project.create({ projecttitle, ProjectDescription, GitHubLink, YoutubeLink });

    return NextResponse.json({
      msg: ["Project sent successfully"],
      success: true,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      console.log(errorList);
      return NextResponse.json({ msg: errorList });
    } else {
      return NextResponse.json({ msg: ["Unable to send Project."] });
    }
  }
}