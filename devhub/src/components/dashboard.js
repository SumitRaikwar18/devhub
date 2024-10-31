// components/Dashboard.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  const [repositories, setRepositories] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchRepositories();
      fetchContributions();
    }
  }, [session]);

  // Fetch the user's repositories
  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      setRepositories(response.data);
    } catch (error) {
      console.error("Error fetching repositories", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the user's contributions (issues, pull requests, and commits)
  const fetchContributions = async () => {
    try {
      const response = await axios.get(
        "https://api.github.com/search/issues?q=author:" +
          session.user.name +
          "+type:pr+is:merged",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      setContributions(response.data.items);
    } catch (error) {
      console.error("Error fetching contributions", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Repositories Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Repositories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="p-4 bg-gray-100 rounded-md shadow-md"
            >
              <h3 className="font-bold text-lg">{repo.name}</h3>
              <p>{repo.description}</p>
              <p className="text-sm mt-2">
                <span className="font-semibold">Stars:</span> {repo.stargazers_count}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Forks:</span> {repo.forks_count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contributions Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Contributions</h2>
        <div className="space-y-4">
          {contributions.map((contribution) => (
            <div
              key={contribution.id}
              className="p-4 bg-blue-100 rounded-md shadow-md"
            >
              <a
                href={contribution.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-bold"
              >
                {contribution.title}
              </a>
              <p className="text-sm">
                <span className="font-semibold">Repository:</span>{" "}
                {contribution.repository_url.split("/").pop()}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Created at:</span>{" "}
                {new Date(contribution.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Top Contributions</h2>
        <div className="space-y-4">
          {contributions
            .slice(0, 5)
            .map((contribution, index) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between p-4 bg-green-100 rounded-md shadow-md"
              >
                <span className="text-lg font-semibold">
                  #{index + 1} {contribution.title}
                </span>
                <a
                  href={contribution.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  View
                </a>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
