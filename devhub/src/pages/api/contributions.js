export default async (req, res) => {
    const { token } = req.headers;
  
    const response = await fetch(
      "https://api.github.com/user/repos",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  };
  