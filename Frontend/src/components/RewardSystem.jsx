import { useState } from "react";
import "../styles/rewardSystem.css";

const RewardSystem = () => {
  const [points] = useState(2450);

  const rewards = [
    {
      title: "Free Seat Upgrade",
      cost: 500,
      status: "Available",
      icon: "🎁",
    },
    {
      title: "Priority Matching",
      cost: 1000,
      status: "Available",
      icon: "⚡",
    },
    {
      title: "Premium Badge",
      cost: 1500,
      status: "Available",
      icon: "🏆",
    },
    {
      title: "VIP Support",
      cost: 3000,
      status: "Locked",
      icon: "👑",
    },
  ];

  const achievements = [
    {
      title: "100 Successful Exchanges",
      progress: "100%",
    },
    {
      title: "Trusted Passenger",
      progress: "Completed",
    },
    {
      title: "Safety Champion",
      progress: "80%",
    },
  ];

  return (
    <div className="reward-page">
      <div className="reward-header">
        <div>
          <h1>🏆 Reward & Trust Center</h1>
          <p>Earn points, unlock rewards and become a top RailSwap traveler.</p>
        </div>

        <button className="redeem-btn">Redeem Points</button>
      </div>

      <div className="reward-top">
        <div className="points-card">
          <h3>Total Reward Points</h3>

          <div className="points-circle">{points}</div>

          <div className="member-badge">⭐ Gold Member</div>

          <div className="level-section">
            <span>Next Level: Platinum</span>

            <div className="level-bar">
              <div className="level-fill"></div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <h2>48</h2>
            <p>Exchanges</p>
          </div>

          <div className="stat-box">
            <h2>92%</h2>
            <p>Trust Score</p>
          </div>

          <div className="stat-box">
            <h2>15</h2>
            <p>Rewards Earned</p>
          </div>

          <div className="stat-box">
            <h2>#27</h2>
            <p>Global Rank</p>
          </div>

          <div className="stat-box">
            <h2>12</h2>
            <p>Day Streak</p>
          </div>

          <div className="stat-box">
            <h2>Top 10%</h2>
            <p>Traveler</p>
          </div>
        </div>
      </div>

      <div className="reward-section">
        <h2>🎁 Available Rewards</h2>

        <div className="reward-grid">
          {rewards.map((reward, index) => (
            <div className="reward-card" key={index}>
              <div className="reward-icon">{reward.icon}</div>

              <h3>{reward.title}</h3>

              <p>Cost: {reward.cost} Points</p>

              <span
                className={
                  reward.status === "Available" ? "available" : "locked"
                }
              >
                {reward.status}
              </span>

              <button>Redeem</button>
            </div>
          ))}
        </div>
      </div>

      <div className="streak-card">
        <h3>🔥 Weekly Streak</h3>
        <h1>12 Days</h1>
        <p>Keep earning points daily.</p>
      </div>

      <div className="achievement-section">
        <h2>🏅 Achievements</h2>

        {achievements.map((item, index) => (
          <div key={index} className="achievement-card">
            <h3>{item.title}</h3>

            <span>{item.progress}</span>
          </div>
        ))}
      </div>

      <div className="reward-ai-card">
        <div className="ai-top">
          <h3>🤖 AI Reward Advisor</h3>

          <span>Smart Suggestion</span>
        </div>

        <p>You have enough points to unlock Priority Matching.</p>

        <p>
          Expected seat exchange success:
          <strong> +18%</strong>
        </p>
      </div>
    </div>
  );
};

export default RewardSystem;
