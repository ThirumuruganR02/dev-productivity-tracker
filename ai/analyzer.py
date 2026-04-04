import json
import sys
import urllib.request
from datetime import datetime, timezone

def get_sessions():
    """Fetch coding sessions from our backend API"""
    try:
        url = "http://localhost:5000/api/sessions"
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        # Sample data if server not running
        return [
            {"language": "JavaScript", "duration": 60, "hour": 22},
            {"language": "Python", "duration": 45, "hour": 22},
            {"language": "JavaScript", "duration": 90, "hour": 10},
            {"language": "Python", "duration": 30, "hour": 23},
            {"language": "JavaScript", "duration": 120, "hour": 22},
        ]

def get_github_stats():
    """Fetch GitHub stats from our backend API"""
    try:
        url = "http://localhost:5000/api/github/stats"
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode())
    except:
        return {}

def analyze_productivity(sessions):
    """Analyze coding sessions and generate insights"""
    if not sessions:
        return {"error": "No sessions found"}

    # --- Language Analysis ---
    lang_time = {}
    for s in sessions:
        lang = s.get("language", "Unknown")
        duration = s.get("duration", 0)
        lang_time[lang] = lang_time.get(lang, 0) + duration

    top_language = max(lang_time, key=lang_time.get)
    total_minutes = sum(lang_time.values())

    # --- Productivity Hours Analysis ---
    hour_time = {}
    for s in sessions:
        hour = s.get("hour", 0)
        duration = s.get("duration", 0)
        hour_time[hour] = hour_time.get(hour, 0) + duration

    best_hour = max(hour_time, key=hour_time.get)

    # Format hour nicely
    if best_hour == 0:
        hour_label = "12:00 AM (Midnight)"
    elif best_hour < 12:
        hour_label = f"{best_hour}:00 AM"
    elif best_hour == 12:
        hour_label = "12:00 PM (Noon)"
    else:
        hour_label = f"{best_hour - 12}:00 PM"

    # --- Consistency Analysis ---
    dates = set()
    for s in sessions:
        date_str = s.get("date", "")
        if date_str:
            dates.add(date_str[:10])  # Extract YYYY-MM-DD

    consistency_score = min(len(dates) * 10, 100)  # 10 points per day, max 100

    # --- AI Suggestions ---
    suggestions = []

    # Suggestion 1: Peak hours
    suggestions.append(
        f"⏰ You code best at {hour_label} — schedule your hardest tasks then!"
    )

    # Suggestion 2: Language focus
    lang_percent = (lang_time[top_language] / total_minutes * 100) if total_minutes > 0 else 0
    suggestions.append(
        f"💻 You spend {lang_percent:.0f}% of your time in {top_language} — great focus!"
    )

    # Suggestion 3: Consistency
    if len(dates) <= 1:
        suggestions.append(
            "📅 Code every day — even 15 minutes daily beats 3 hours once a week!"
        )
    elif len(dates) <= 3:
        suggestions.append(
            f"📅 You've coded on {len(dates)} days — aim for a 7-day streak!"
        )
    else:
        suggestions.append(
            f"🔥 Amazing! You've coded on {len(dates)} different days — keep the streak alive!"
        )

    # Suggestion 4: Session length
    avg_session = total_minutes / len(sessions)
    if avg_session < 30:
        suggestions.append(
            "⚡ Your sessions are short — try the Pomodoro technique: 25 min focus + 5 min break"
        )
    elif avg_session > 120:
        suggestions.append(
            "😴 Your sessions are very long — take breaks every 90 mins to stay sharp!"
        )
    else:
        suggestions.append(
            f"✅ Great session length! Averaging {avg_session:.0f} mins — perfect for deep work!"
        )

    return {
        "totalMinutes": total_minutes,
        "totalHours": round(total_minutes / 60, 1),
        "totalSessions": len(sessions),
        "topLanguage": top_language,
        "languageBreakdown": lang_time,
        "bestHour": hour_label,
        "consistencyScore": consistency_score,
        "daysActive": len(dates),
        "suggestions": suggestions
    }

def main():
    print("\n" + "="*50)
    print("  🚀 DEV PRODUCTIVITY TRACKER - AI ANALYSIS")
    print("="*50 + "\n")

    # Fetch data
    print("📡 Fetching your coding sessions...")
    sessions = get_sessions()
    print(f"✅ Found {len(sessions)} sessions\n")

    print("📡 Fetching GitHub stats...")
    github = get_github_stats()
    if github.get("username"):
        print(f"✅ GitHub: @{github['username']} | {github.get('publicRepos', 0)} repos\n")

    # Analyze
    analysis = analyze_productivity(sessions)

    # Display results
    print("📊 YOUR PRODUCTIVITY REPORT")
    print("-"*40)
    print(f"⏱️  Total Coding Time : {analysis['totalHours']} hours")
    print(f"📝 Total Sessions    : {analysis['totalSessions']}")
    print(f"💻 Top Language      : {analysis['topLanguage']}")
    print(f"⭐ Best Coding Hour  : {analysis['bestHour']}")
    print(f"📅 Days Active       : {analysis['daysActive']}")
    print(f"🎯 Consistency Score : {analysis['consistencyScore']}/100")

    print("\n🧠 AI SUGGESTIONS")
    print("-"*40)
    for suggestion in analysis['suggestions']:
        print(f"  {suggestion}")

    print("\n📈 LANGUAGE BREAKDOWN")
    print("-"*40)
    for lang, minutes in sorted(analysis['languageBreakdown'].items(),
                                 key=lambda x: x[1], reverse=True):
        hours = minutes / 60
        bar = "█" * int(hours * 5)
        print(f"  {lang:<15} {hours:.1f}h  {bar}")

    print("\n" + "="*50)
    print("  Analysis complete! Keep coding! 💪")
    print("="*50 + "\n")

    # Save report to JSON
    with open('report.json', 'w') as f:
        json.dump(analysis, f, indent=2)
    print("💾 Report saved to ai/report.json\n")

if __name__ == "__main__":
    main()