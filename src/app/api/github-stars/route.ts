import { personal } from '@/config/personal';

export async function GET(req: Request) {
  try {
    // Basic validation: expect /repos/{owner}/{repo}
    if (!personal.github.apiRepoUrl.includes('/repos/')) {
      return Response.json({ stars: 0 }, { status: 200 });
    }

    // Build headers safely (no undefined values)
    const headers: Record<string, string> = {};
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(personal.github.apiRepoUrl, {
      headers,
      // avoid long hangs locally
      // @ts-ignore - AbortSignal.timeout is Node 18+
      signal: (AbortSignal as any).timeout
        ? (AbortSignal as any).timeout(8000)
        : undefined,
    });

    if (!res.ok) {
      return Response.json({ stars: 0 }, { status: 200 });
    }

    const data = await res.json();
    return Response.json({ stars: data.stargazers_count ?? 0 });
  } catch (e) {
    return Response.json({ stars: 0 }, { status: 200 });
  }
}
