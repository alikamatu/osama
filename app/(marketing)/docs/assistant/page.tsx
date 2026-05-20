export default function Page() {
  return (
    <>
      <h1>Assistant</h1>
      <p>
        The assistant is a chat that already knows your tasks, habits, goals, and recent reviews. It&apos;s the difference
        between a generic chatbot and a colleague who&apos;s read your notebook.
      </p>

      <h2>What it can do</h2>
      <ul>
        <li>Draft a plan for today from your open tasks and the time you have.</li>
        <li>Break a goal down into milestones, then milestones into tasks.</li>
        <li>Summarize your week — what moved, what stalled, suggested next steps.</li>
        <li>Triage your inbox into projects.</li>
      </ul>

      <h2>What it won&apos;t do</h2>
      <ul>
        <li>Train on your data. Your content is yours; we don&apos;t fine-tune models on it.</li>
        <li>Make changes without confirmation. Destructive actions always ask first.</li>
        <li>Reach outside Osama. It only sees what&apos;s in your account.</li>
      </ul>

      <h2>Slash commands</h2>
      <ul>
        <li><kbd>/plan</kbd> — propose a daily schedule.</li>
        <li><kbd>/review</kbd> — draft a weekly review from your data.</li>
        <li><kbd>/clear-inbox</kbd> — sort the inbox into projects.</li>
      </ul>

      <h2>Memory</h2>
      <p>
        The assistant maintains a small memory of facts you&apos;ve pinned — your role, preferences, ongoing initiatives.
        Edit or clear it any time from <a href="/settings/ai">Settings → AI</a>.
      </p>
    </>
  );
}
