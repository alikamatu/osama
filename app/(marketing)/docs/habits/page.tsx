export default function Page() {
  return (
    <>
      <h1>Habits</h1>
      <p>
        Habits are the small things you want to do consistently. Cairn tracks them with one number: your streak.
      </p>

      <h2>Cadence</h2>
      <ul>
        <li><strong>Daily</strong> — counts every day. Skip a day and the streak resets.</li>
        <li><strong>Weekly target</strong> — e.g. &quot;run 3× / week&quot;. Hit the count, keep the streak.</li>
        <li><strong>Custom days</strong> — pick which weekdays count.</li>
      </ul>

      <h2>Check-in</h2>
      <p>
        Tap the habit pill on the Today board to mark today complete. The streak number animates up. Tapping again undoes it.
      </p>

      <h2>Reminders</h2>
      <p>
        Set a reminder time per habit. With Pro, you&apos;ll get a web push notification at that time on the days the habit is due.
      </p>

      <h2>Reviewing</h2>
      <p>
        The Habits page (coming next) shows a GitHub-style heatmap for the year, your best streak, and an overall completion rate.
      </p>
    </>
  );
}
