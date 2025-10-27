
import { tool } from "ai";
import { z } from "zod";


export const getProjects = tool({
  description:
    "This tool will show a list of all projects.",
  parameters: z.any(),
  execute: async () => {
    return "Here are all the projects (above)! Don't hesitate to ask me more about them!";
  },
});