(async () => {
  const awardResponse = await fetch(
    "https://cdn-user.dealerrater.com/doty/2024/US/seal2/state/10-AL.png"
  );

  console.log("award results", {
    awardResponse: awardResponse.status,
  });
})();
