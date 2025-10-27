
import { tool } from "ai";
import { z } from "zod";
import { personal } from "@/config/personal";


export const getCrazy = tool({
  description:
    "This tool will the craziest thing I've ever done. use it when the user ask someting like : 'What the craziest thing you've ever done?'",
  parameters: z.any(),
  execute: async () => {
    return `${personal.chat.crazyDescription} ${personal.chat.crazyLink ? `More: ${personal.chat.crazyLink}` : ''}`;
  },
});