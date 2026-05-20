export default function Page() {
  return (
    <>
      <h1>API reference</h1>
      <p>
        The Cairn API will let you read and write tasks, habits, goals, and notes from your own scripts. It&apos;s on the
        roadmap right after the persistence layer.
      </p>

      <h2>Authentication</h2>
      <p>Personal access tokens, scoped per workspace. Create from <a href="/settings/connections">Settings → Connections</a>.</p>

      <h2>Endpoints (planned)</h2>
      <pre><code>{`GET    /v1/tasks
POST   /v1/tasks
PATCH  /v1/tasks/{id}
DELETE /v1/tasks/{id}

GET    /v1/habits
POST   /v1/habits/{id}/checkin

GET    /v1/goals
PATCH  /v1/goals/{id}/status

POST   /v1/inbox/capture`}</code></pre>

      <h2>Webhooks</h2>
      <p>
        Subscribe to events: <code>task.completed</code>, <code>habit.streak.broken</code>, <code>goal.at-risk</code>. Useful for
        bridging into Notion, Slack, or your own automations.
      </p>

      <h2>SDKs</h2>
      <p>Official TypeScript SDK is planned. Until then, the REST API will be the only surface.</p>

      <h2>Rate limits</h2>
      <p>Free: 60 req/min. Pro: 600 req/min. Burst over for short windows.</p>
    </>
  );
}
