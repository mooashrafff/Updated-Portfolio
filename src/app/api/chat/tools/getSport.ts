
import { tool } from "ai";
import { z } from "zod";
import { personal } from "@/config/personal";


export const getSports = tool({
  description:
    "This tool will show some sports photos.",
  parameters: z.any(),
  execute: async () => {
    return "Here are some of my best pictures doing sports!";
  },
});