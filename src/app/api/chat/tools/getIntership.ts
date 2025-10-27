import { tool } from 'ai';
import { z } from 'zod';
import { personal } from '@/config/personal';

export const getInternship = tool({
  description:
    "Gives a summary of what kind of internship I'm looking for, plus my contact info and how to reach me. Use this tool when the user asks about my internship search or how to contact me for opportunities.",
  parameters: z.any(),
  execute: async () => {
    const links = personal.internship.contactLinks
      .map((l) => `- ${l.name}: ${l.url}`)
      .join('\n');
    const socials = personal.contact.socials
      .map((s) => `- ${s.name}: ${s.url}`)
      .join('\n');

    return `Here’s what I’m looking for 👇

- 📅 **Duration**: ${personal.internship.duration} starting **${personal.internship.startDate}**
- 🌍 **Location**: ${personal.internship.locationPreference}
- 🧑‍💻 **Focus**: ${personal.internship.focus}
- 🛠️ **Stack**: ${personal.internship.stack}
- 💼 **Visa**: ${personal.internship.visa}
- ✅ **What I bring**: ${personal.internship.whatIBring}

📬 **Contact me** via:
- Email: ${personal.internship.contactEmail}
${links || socials}

Let's connect ✌️`;
  },
});
