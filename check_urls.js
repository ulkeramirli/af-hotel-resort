const check = async (url) => {
  const r = await fetch(url);
  console.log(r.status, url);
};

(async () => {
  await check('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'); // salad/healthy
  await check('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'); // meat/bbq
  await check('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'); // pizza
  await check('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'); // burger/fastfood
  await check('https://images.unsplash.com/photo-1547592180-85f173990554?w=400'); // soup
  await check('https://images.unsplash.com/photo-1481070414801-36fd0f0ab360?w=400'); // cheese/appetizer
  await check('https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400'); // fish/salmon
  await check('https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400'); 
  await check('https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400'); // tea
  await check('https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400'); // drinks
  await check('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'); // bread/qutab
})();
