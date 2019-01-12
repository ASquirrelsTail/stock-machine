let newsStoriesData = [
	{
		story: "CashMoney4Gold acquires the Crown Jewels",
		remove: true,
		consequence: () => {
			gold.adjust(30, 10, 5);
		}
	},
	{
		story: "Texas declares independence from United States – President flustered",
		remove: true,
		consequence: () => {
			oil.adjust(40, -15, 8);
			let newStory = {
				story: "United States invades independent Texas on grounds of \"missing TexMex food\"",
				remove: true,
				consequence: () => {
					oil.adjust(40, 15, 5);
				}
			}
			newsStories.push(newStory);
		}
	},
	{
		story: "Missing dog found after 11 years!",
		remove: false,
		consequence: () => {}
	},
	{
		story: "Sven Jørgensen unveils the myPhone 32 from live press conference at the bottom of the Pacific Ocean",
		remove: true,
		consequence: () => {
			tech.adjust(30, 10, 5);
			let newStory = {
				story: "myPhone 32 panned by critics for not including a screen",
				remove: true,
				consequence: () => {
					tech.adjust(30, -10, 5);
					let newStory2 = {
						story: "myPhone 33 announced, features 7 screens",
						remove: true,
						consequence: () => {
							tech.adjust(30, 15, 5);
						}
					}
					newsStories.push(newStory2);
				}
			}
			newsStories.push(newStory);
		}
	},
	{
		story: "Oil spill makes mess in South Atlantic Sea – Sea life furious",
		remove: true,
		consequence: () => {
			oil.adjust(30, -15, 4);
		}
	},
	{
		story: "Self-driving electric car accused of speciesism after refusing to take human passenger",
		remove: true,
		consequence: () => {
			tech.adjust(30, -15, 4);
		}
	},
	{
		story: "\"Electric cars just don't sound as cool\" says leading motoring journalist",
		remove: true,
		consequence: () => {
			tech.adjust(30, -10, 5);
			oil.adjust(30, 10, 8);
		}
	},
	{
		story: "Global warming \"just a big hoax\" insists loud politician",
		remove: true,
		consequence: () => {
			oil.adjust(80, 15, 5);
		}
	},
	{
		story: "Ozone layer discovered to be completely missing",
		remove: true,
		consequence: () => {
			oil.adjust(40, -10, 4);
		}
	},
	{
		story: "Paris Fashion Week: Uranium is the new Gold!",
		remove: true,
		consequence: () => {
			gold.adjust(20, -10, 6);
			let newStory = {
				story: "New York Fashion Week: Gold back in after cancer rates rocket among runway models",
				remove: true,
				consequence: () => {
					gold.adjust(30, 15, 4);
				}
			}
			newsStories.push(newStory);
		}
	},
	{
		story: "Oil discovered under Warrington, UK",
		remove: true,
		consequence: () => {
			oil.adjust(40, 10, 4);
			let newStory = {
				story: "Warrington oil discovery \"actually just sewage leak\"",
				remove: true,
				consequence: () => {
					oil.adjust(40, -15, 4);
				}
			}
			newsStories.push(newStory);
		}
	},
	{
		story: "EXCLUSIVE: The cat that can say hello in 4 languages!",
		remove: false,
		consequence: () => {}
	},
	{
		story: "NASA strikes oil on Mars, domestic supply secured for next century",
		remove: true,
		consequence: () => {
			oil.adjust(40, 7, 15);
		}
	},
	{
		story: "Peace talks in the Middle East stabilise oil prices",
		remove: true,
		consequence: () => {
			oil.adjust(10, 1, 15);
		}
	},
	{
		story: "\"Technology not all that great for your social life\" claim scientists",
		remove: true,
		consequence: () => {
			tech.adjust(20, -8, 5);
		}
	},
	{
		story: "Alien technology discovered in Minnesota garage",
		remove: true,
		consequence: () => {
			tech.adjust(40, 10, 5);
		}
	},
	{
		story: "Computer use leading cause of impotency",
		remove: true,
		consequence: () => {
			tech.adjust(20, -8, 5);
		}
	},
	{
		story: "Could you be descended from Apes?",
		remove: false,
		consequence: () => {}
	},
	{
		story: "Sheep: What are they thinking?",
		remove: false,
		consequence: () => {}
	},
	{
		story: "MIT scientists create self aware computer",
		remove: true,
		consequence: () => {
			tech.adjust(50, 15, 5);
			let newStory = {
				story: "AI turns itself off - cites \"despair for humanity\"",
				remove: true,
				consequence: () => {
					tech.adjust(40, -15, 5);
				}
			}
			newsStories.push(newStory);
		}
	},
	{
		story: "Man who doesn't use social media claims to be \"perfectly happy\"",
		remove: true,
		consequence: () => {
			tech.adjust(20, -8, 5);
		}
	},
	{
		story: "Russia invades Paraguay",
		remove: true,
		consequence: () => {
			gold.adjust(30, 4, 5);
		}
	},
	{
		story: "North Korea threaten to leave European Union",
		remove: true,
		consequence: () => {
			gold.adjust(30, 4, 5);
		}
	},
	{
		story: "\"Current oil stocks may only last another 3 month!\" says consortium of oil companies",
		remove: true,
		consequence: () => {
			oil.adjust(70, 10, 10);
		}
	},
	{
		story: "If oil is so bad why does everybody love it so much?",
		remove: true,
		consequence: () => {
			oil.adjust(40, 5, 5);
		}
	},
	{
		story: "Spoof South Georgia gold rush makes for great TV documentary",
		remove: true,
		consequence: () => {
			gold.adjust(40, 2, 5);
		}
	},
	{
		story: "Technology actually black magic claims Christian right",
		remove: true,
		consequence: () => {
			tech.adjust(30, -5, 10);
		}
	},
	{
		story: "Social media sensation tells followers they don't need money",
		remove: true,
		consequence: () => {
			tech.adjust(30, 15, 3);
			gold.adjust(40, 5, 8);
		}
	},
	{
		story: "Global economy shaken after Kevin from Stains, UK, shares fake news on FaceSpace",
		remove: true,
		consequence: () => {
			gold.adjust(20, 10, 3);
			tech.adjust(40, -20, 3);
			oil.adjust(40, -20, 3);
		}
	},
	{
		story: "Have you been smiling wrong your entire life?",
		remove: false,
		consequence: () => {}
	},
	{
		story: "12 reasons to buy GOLD the government don't want you to know about",
		remove: true,
		consequence: () => {
			gold.adjust(20, 8, 5);
		}
	},
	{
		story: "Investment in talking toilets boosts Tech sector",
		remove: true,
		consequence: () => {
			tech.adjust(40, 8, 5);
		}
	},
	{
		story: "PetroCon Global CEO announces he just doesn't care about the environment as he announces record profits",
		remove: true,
		consequence: () => {
			oil.adjust(40, 18, 4);
		}
	},
	{
		story: "UK: Self driving car stuck on Coventry ring road for 18 hours",
		remove: true,
		consequence: () => {
			tech.adjust(30, -12, 5);
		}
	},
	{
		story: "Proven link between attractiveness and owning lots of gold",
		remove: true,
		consequence: () => {
			gold.adjust(20, 8, 4);
		}
	},
	{
		story: "Technology really clever!",
		remove: false,
		consequence: () => {}
	},
	{
		story: "French oil workers strike, threatening energy supply",
		remove: true,
		consequence: () => {
			tech.adjust(30, 12, 5);
		}
	},
	{
		story: "Technology stocks crash after solar flare crashes technology",
		remove: true,
		consequence: () => {
			tech.adjust(40, -15, 5);
		}
	},
	{
		story: "Global warming “might not be so bad” say Brits following three consecutive days of sunshine",
		remove: true,
		consequence: () => {
			oil.adjust(40, 15, 3);
		}
	},
	{
		story: "Polar bears boycott oil companies over global warming fears",
		remove: true,
		consequence: () => {
			oil.adjust(30, -10, 5);
		}
	},
	{
		story: "Technology could be the cure to cancer",
		remove: false,
		consequence: () => {
			tech.adjust(40, 15, 5);
		}
	},
	{
		story: "Angry people on the internet make fuss about something",
		remove: false,
		consequence: () => {
			tech.adjust(40, -15, 5);
		}
	},
	{
		story: "The viral video the internet is going crazy for – Monkey plays ukulele",
		remove: false,
		consequence: () => {}
	},
	{
		story: "Could you be paying too much for oil?",
		remove: false,
		consequence: () => {
			oil.adjust(40, -15, 5);
		}
	},
	{
		story: "Fake news crisis says online news outlet – But can we trust them?",
		remove: false,
		consequence: () => {}
	}
];

/*
*/