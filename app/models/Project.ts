import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
  projecttitle: {
    type: String,
    

  },

  ProjectDescription: {
    type: String,
    

  },

  GitHubLink: {
    type: String,
    
  },

  YoutubeLink: {
    type: String,
   
  },
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;