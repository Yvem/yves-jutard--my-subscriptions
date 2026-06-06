import { auth, clerkClient } from "@clerk/nextjs/server"

import { assert_from } from "@monorepo-private/assert"
import {
	createꓽclient as createꓽclientⵧlinkdapi,
	MAX_COUNT,
	GETꓽⳇpostsⳇall,
	GETꓽⳇsearchⳇpeople,
} from "@monorepo-private/client--com.linkdapi"
import { createꓽclient as createꓽclientⵧlinkedin, GETꓽⳇuserinfo } from "@monorepo-private/client--com.linkedin.api"

// XXX TEMP DEV, TO CLEAN
const MOCK_CALLS = true

export async function GET() {
	const ǃ = assert_from({ GET })

	const { userId } = await auth()
	if (!userId) return new Response("Unauthorized", { status: 401 })

	const clientⵧclerk = await clerkClient()
	const userⵧclerk = await clientⵧclerk.users.getUser(userId)
	if (!userⵧclerk) return Response.json({}) // not ready yet

	const tokens = await clientⵧclerk.users.getUserOauthAccessToken(userId, "linkedin_oidc")
	const access_tokenⵧlinkedin = tokens.data[0]?.token ?? null // there is usually only 1
	if (!access_tokenⵧlinkedin) return new Response("Missing LinkedIn Connection", { status: 401 })

	const clientⵧlinkedin = createꓽclientⵧlinkedin({
		headers: {
			Authorization: `Bearer ${access_tokenⵧlinkedin}`,
		},
	})
	const userⵧlinkedin = await GETꓽⳇuserinfo(clientⵧlinkedin)

	// LinkedIn doesn't allow getting posts, use another provider
	// NOTE that there is a risk we're not picking the right LinkedIn user,
	// since LinkedIn doesn't expose uids
	// TODO would need a way for the user to pass their vanity id OR fixate their urn
	ǃ.require(!!process.env["LINKDAPI_KEY"], `LINKDAPI_KEY required`)
	const clientⵧlinkdapi = createꓽclientⵧlinkdapi({
		headers: {
			"X-linkdapi-apikey": process.env["LINKDAPI_KEY"],
		},
	})

	const userⵧlinkdapi = await (async () => {
		if (MOCK_CALLS) {
			console.log({ userⵧlinkedin })
			return {
				urn: "ACoAAABCMjsBlsnsypQrujQIErVuOdIdbCIH5O0",
				profileID: "4338235",
				url: "https://www.linkedin.com/in/yves-jutard",
				firstName: "Yves",
				lastName: "Jutard",
				fullName: "Yves Jutard",
				headline: "AI Product Engineer, ex. Atlassian, ex. Canva,                     yves.jutard.com",
				location: "Sydney, NSW",
				profilePictureURL:
					"https://media.licdn.com/dms/image/v2/D5603AQF3FUWosNI41A/profile-displayphoto-scale_100_100/B56Z24vV14KIAc-/0/1776920914499?e=1782345600&v=beta&t=5Bhta39RJWGgx00FJJPvldmzq6MK_z5lA9f_dvgdPTU",
				premium: true,
			}
		}

		const candidates = await GETꓽⳇsearchⳇpeople(clientⵧlinkdapi, {
			firstName: userⵧlinkedin.given_name,
			lastName: userⵧlinkedin.family_name,
			profileLanguage: "en",
			count: MAX_COUNT,
		})
		return candidates[0]
	})()

	const posts = await (async () => {
		if (MOCK_CALLS) {
			console.log({ userⵧlinkdapi })
			return [
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7468108019654893568",
					type: "original",
					content:
						"I was asked in an interview \"What's the latest feature introduced in Claude Code?\" I couldn't answer 🥲 (I was not Claude-maxxing at this moment.) It turns out there is a dedicated official page for that, with weekly updates: https://lnkd.in/gPxMkK6i\nEnjoy!",
					engagements: {
						totalReactions: 2,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 1 },
							{ reactionType: "INTEREST", reactionCount: 1 },
						],
					},
					tms: 1780535702623,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7468069923433623552",
					type: "reshare",
					content:
						"That's next-gen Applied AI 👏 First we make the old tools/processes better; Then the real change is when we evolve them.\nThe user interfaces to most of the software we use today are static. When you go to gmail, you see the same inbox UI that I use, even though we may use gmail very differently. \n\nThis happened because most users can't develop or modify software easily, which is no longer true now that we have AI. I believe one of the biggest paradigm shift that's about to happen is that user interfaces will become hyper-personal. \n\nYou \"talk to\" the software you are using, and \"ask\" it to become exactly how you want it. \n\nI built a proof of concept called \"Baby Menu\". It's a Mac OS menu bar app that hilariously does nothing out of the box (hence \"baby\"), but you can talk to it and ask it to become whatever you want. \n\nIt's working surprisingly well for myself and I'm getting addicted to this way of using software. I've already deleted most of my other menu bar apps because my baby menu has turned into the one app that gives me exactly what I need: CPU / memory monitor, github activities, claude / codex quota tracking, and a mini todo list.\n\nI open sourced baby menu at https://lnkd.in/gVDC-h6g and you can install it via homebrew to try it out: brew install --cask kunchenguid/tap/baby-menu\n\nUnder the hood it's a self-evolving, hot-reloadable electron app that comes with a design system that makes the look and feel consistent. It runs your existing coding agents to make modifications to itself based on your prompts, and uses git to track versions so you can rollback to any previous state easily. \n\n\nNow imagine every piece of software you use can be modified on the fly based on what you want from it. I believe this is the future we're heading towards and I feel very excited about it. \n\nWe software builders in this world will shift from building feature after feature, to anticipating a diverse set of user needs and establishing the core primitives and design system such that the user's agent can use those as building blocks to achieve whatever the user asks for. This is a ton of fun.",
					engagements: {
						totalReactions: 1,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [{ reactionType: "LIKE", reactionCount: 1 }],
					},
					tms: 1780526619776,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7467871739750989824",
					type: "original",
					content:
						"First Qwen Meetup in Sydney, at the Alibaba Group office. Thanks Oliver Zhang for inviting! I’ve been running a little Qwen3.5 4B locally with Ollama on my MacBook Air, it fits!",
					engagements: {
						totalReactions: 5,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [{ reactionType: "LIKE", reactionCount: 5 }],
					},
					tms: 1780479369104,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7467869780935483393",
					type: "reshare",
					content:
						"Calling all developers working on good tech 📢 Mozilla Festival wants to see your work 👀 \n\nApply by May 24!\nhttps://mzl.la/4v0dopJ\nOpen source AI is growing in the wild 🪴 but who gets to decide if what’s being built becomes durable, or gets paved over?\n\n#MozFest 2026's Developers Wilding track is where that conversation happens, and we’re looking for principal engineers, safety leads, standards folks to lead the discussion.\n\nSound like you? We're keen to see your work!\n\nSubmit your work ASAP! CFP closes May 24 🗓️ \nhttps://mzl.la/4fAO3y5",
					engagements: {
						totalReactions: 21,
						commentsCount: 1,
						repostsCount: 3,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 18 },
							{ reactionType: "APPRECIATION", reactionCount: 2 },
							{ reactionType: "PRAISE", reactionCount: 1 },
						],
					},
					tms: 1780478902086,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7465727715669688321",
					type: "original",
					content:
						"Great meetup tonight by Claude Community Australia , great prez about multi-agent orchestration by Arthur Backouche + several lightning talks 👏\n\nGreat to see Australian experts and builders sharing they knowledge.",
					engagements: {
						totalReactions: 21,
						commentsCount: 1,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 15 },
							{ reactionType: "EMPATHY", reactionCount: 3 },
							{ reactionType: "APPRECIATION", reactionCount: 2 },
							{ reactionType: "PRAISE", reactionCount: 1 },
						],
					},
					tms: 1779968193929,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7465354083177009152",
					type: "original",
					content:
						'Applied AI: in the coming years, all apps will need to be adapted to AI agents with 1) sub-accounts 2) permissions attenuation ↓↓\n\na user (human) should be able to "hire agentic employees" (agents/bots) on their behalf =\n • A user should be able to create sub-accounts in every systems without having to ask an admin\n • Those sub-accounts should be attributable to their "employer/operator" in some way - for accountability and reporting\n • Those sub-accounts should not be treated differently by the company systems (except maybe generic safeguards / rate limitings)\n • All sub-accounts should inherit their user\'s permissions by default (or inherit following a standard policy such as read-only, upgradeable)\n • The user should be able to attenuate the permissions given to their "agentic employees"\n\nExamples:\n • At the moment, GitHub doesn\'t allow me to create a bot account using a agent-friendly email ("suspicious behavior from your computer"). I could create a dedicated Gmail account, but once again, that\'s against Google policies and the account could be banned at any time.\n • Some other tools don\'t allow me to create a token with fine-grained permissions, even a basic read/write\n • Even when I can create such a token, it\'s still attributed to my identity = I can\'t create "bots" that would interact with the company systems under a clearer sub-identity\n\nSurprisingly, Wikipedia is bot-friendly since ~2009, with native concepts of bots, bot operators, bots "stop buttons" that should inspire agent-friendly apps https://lnkd.in/gMF_T8Ea\n\nSolutions:\n • Tools must become agent-friendly as described above\n • tokens should follow the advanced "macaroon" pattern which allows delegation and attenuation, cf. Fly.io https://lnkd.in/gCvXmAaR https://lnkd.in/gTHf72di\n\nSome agent-friendly tools are appearing e.g. AgentMail (YC S25) they\'re rare but will naturally expand.',
					engagements: {
						totalReactions: 5,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 4 },
							{ reactionType: "INTEREST", reactionCount: 1 },
						],
					},
					tms: 1779879113001,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7464212127269134336",
					type: "original",
					content:
						"I was reviewing durable execution solutions this WE (focused on temporal vs. inngest) and this great post from Earendil has a great comparison between 6 solutions, very interesting read https://lnkd.in/gSVJgqgY",
					engagements: {
						totalReactions: 2,
						commentsCount: 2,
						repostsCount: 0,
						reactions: [{ reactionType: "LIKE", reactionCount: 2 }],
					},
					tms: 1779606849496,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7463459106323054592",
					type: "original",
					content:
						'Great Friday arvo reading for Applied AI Engineers: the Lorikeet blog is a goldmine: https://lnkd.in/gRb6UEFE\n\nLearn about evals, guardrails, "pockets of determinism"... all from actual production experience 💡\n\nThanks Lorikeet for sharing so openly 👏',
					engagements: {
						totalReactions: 1,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [{ reactionType: "INTEREST", reactionCount: 1 }],
					},
					tms: 1779427315312,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7463406718169980929",
					type: "original",
					content:
						"Great applied AI Meetup at Relevance AI \n\nTakeaways:\n\n- instead of “what can I do with AI?”, ask “if I could hire someone for free, what would I delegate?”\n\n- “I don’t have a job title anymore, I reconfigure every quarter”\n\n- “first we make the old process faster; the real change is when we evolve the process”",
					engagements: {
						totalReactions: 9,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 8 },
							{ reactionType: "INTEREST", reactionCount: 1 },
						],
					},
					tms: 1779414825003,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7462624292997083138",
					type: "original",
					content: "Help my son raise funds to support the Heart Foundation \nhttps://lnkd.in/g8QsR9-e",
					engagements: {
						totalReactions: 4,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "APPRECIATION", reactionCount: 2 },
							{ reactionType: "LIKE", reactionCount: 2 },
						],
					},
					tms: 1779228280305,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7460479535952683008",
					type: "original",
					content:
						"Claude Code Isn’t the Only Game in Town: alternatives exist with unique strengths. I tried a few: Codex, OpenCode, Gemini, Vibe, Amp.\nRead the review: https://lnkd.in/gZQpD9Ks",
					engagements: {
						totalReactions: 2,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 1 },
							{ reactionType: "INTEREST", reactionCount: 1 },
						],
					},
					tms: 1778716930378,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7460118980230426624",
					type: "original",
					content:
						"AI Meetup with Vercel hosted by Lorikeet \n3 nice talks by Lewis Krishnamurti , Jeremy Y. And Hardique Dasore \nGreat demos of applied AI.\nHardique Dasore mate we wanted a demo of your 3D agents! Maybe next time?",
					engagements: {
						totalReactions: 8,
						commentsCount: 1,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 7 },
							{ reactionType: "EMPATHY", reactionCount: 1 },
						],
					},
					tms: 1778630967195,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7458103359695147008",
					type: "reshare",
					content:
						"Good point. A production AI system should account for model changes:\n- explicit model as much as possible\n- established procedure to re-run the evals and trim/add the prompt(s) (ideally automated with an agentic refinement loop)\nIf your AI product breaks when the default model changes, you don’t have a product.\n\nA quiet shift happened yesterday: GPT-5.5 Instant became the default inside ChatGPT.\nThat one version number (5.5) is a reminder that “the model” is now a moving dependency, not a stable foundation.\n\nHere’s what most teams get wrong: they treat model upgrades like free performance.\nThey’re not free.\nThey change tone, tool-use behavior, edge-case handling, and even what your agent decides is “worth doing.”\n\nThe winners will look less like prompt artists and more like control-plane builders.\nModel routing, automated evals on your real workflows, and rollback paths will matter more than whatever you named your agent.\n\nWhat’s one guardrail you’ve put in place so a model swap doesn’t take your automation down?\n\n#AI #Automation #EnterpriseAI",
					engagements: { totalReactions: 0, commentsCount: 0, repostsCount: 0, reactions: null },
					tms: 1778150405811,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7457743285231558656",
					type: "reshare",
					content:
						'That\'s actual Applied AI ✔\nIn December I posted a job for a senior AI engineer. I got 470 applications in 11 days. About 310 could ship a working LangChain prototype by Tuesday. About 20 could explain what their plan was for the agent at 3am when it had locked itself in a tool-call loop and was burning $40 a minute against the OpenAI bill.\n\nThat is when I rewrote the requisition. The new title is "AI Reliability Engineer". The role description reads more like an SRE charter than a machine learning role. It attracted 41 applications in 3 weeks. Eleven were the strongest engineering candidates I have interviewed in three years.\n\nWhat an AI Reliability Engineer actually does (day-one expectation, not aspirational):\n— Structured tracing rich enough to replay every agent run after the fact\n— Cost guardrails as first-class infrastructure (per-tenant token budgets, per-conversation iteration caps, per-tool circuit breakers, kill switch from a Slack command)\n— Replay infrastructure as a core engineering deliverable, not a side project\n— Eval harness gates for production behaviour, blocking deploys on regression\n— Inference economics modelled per-agent (cost-per-resolved-request, p95, p99, model breakdown)\n\nThe hiring loop has four sections, none of which is "build an agent that does X". Debugging exercise on a recorded production run. Cost-blowup tabletop. Architecture review. Culture interview about postmortems and CFO conversations.\n\nThe title shapes the applicant pool, the interview loop, and the team\'s self-image. Calling the role "AI Engineer" tells the candidate the work is building. Calling it "AI Reliability Engineer" tells them the work is keeping the building alive.\n\n#AIEngineering #SRE #Hiring #LLMOps #Reliability',
					engagements: {
						totalReactions: 3,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [{ reactionType: "LIKE", reactionCount: 3 }],
					},
					tms: 1778064557369,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7456895412785016832",
					type: "original",
					content:
						"APRA (Australia's prudential supervisor) issued an important letter to industry on AI yesterday, and it's well worth a read. As someone who spends a lot of time thinking about how to effectively govern this technology, I found it refreshingly sensible, hitting many of the right notes.\n\nSome of the things that stand out:\n\n- They're insisting that the people accountable for AI - right up to boards - develop enough technical literacy to challenge what they're being shown, rather than believe everything they see in shiny vendor presentations.\n- They're explicitly rejecting the \"AI is just another technology\" framing, because the risk surface genuinely behaves differently: models drift, agents act, prompts misbehave with untrusted input, and the same system can touch operational risk, cyber, data, model behaviour, privacy and conduct simultaneously. \n- They highlight the increase in cyber threat: AI both expands the attack surface and collapses the timeline on remediation, which means the basics we've all known matter for years (patching, hardened configurations) now matter on a much shorter clock.\n\nThe part I'm drawn to the most, though, is in the assurance section. They note that point-in-time, sample-based assurance methods don't work for systems that learn, adapt and degrade, and that very few organisations have continuous validation in place. That's the structural problem that I'm particularly interested in.\n\nWhen reasoning and decision-making are being outsourced to systems operating at machine speed, traditional risk management cadence simply doesn't scale. A risk specialist cannot individually assess thousands of agents. Even if they could, the models change underneath them, and behaviour shifts the moment untrusted content enters the loop. The only viable answer I can see is to build runtime mechanisms - automated prevention and detection that operate at the same speed as the AI itself. But that requires significant new technical capability, and the organisational competence to wield it well, as well as the literacy to challenge it meaningfully. People, process, and technology, all of it, all at once. There is no single-axis solution here.\n\nThankfully there is a growing community thinking about this now, across DevOps, formal verification, platform engineering, security and architecture. We're all approaching this challenge from different angles, and a real convergence is starting to emerge - in frameworks, theories or reference architectures. What motivates me the most is how we turn any of it into something real - something that actually lays down a pit of success for the people building with this technology, so they can get on with the work without taking risks they don't realise they're taking, or freezing because they're afraid to move. The engineer in me really wants to see it come to life.\n\nIf you're interested in this too, please reach out!\n\nLink to the APRA letter in the comments.",
					engagements: {
						totalReactions: 77,
						commentsCount: 3,
						repostsCount: 3,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 56 },
							{ reactionType: "INTEREST", reactionCount: 15 },
							{ reactionType: "EMPATHY", reactionCount: 5 },
							{ reactionType: "PRAISE", reactionCount: 1 },
						],
					},
					tms: 1777862408825,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7456895176574423040",
					type: "original",
					content:
						"I see developers walking around with open laptops because ‘their agents are coding’... that's not an agent... that's a screensaver with anxiety.\n\nMy AI agents live in tmux on a headless Linux sandbox with real harnesses, LSPs, debuggers, tons of tooling and skills, and an agent filesystem with an immutable audit trail that understands what `undo` means.\n\nIf you want enterprise coding, you gotta give your agents enterprise tooling. Not Instagram vibecoding and a prayer that it didn't drop prod while you closed the lid.\n\nThe real deal doesn't fit in a backpack.\n\nMake sure you own your AI. AI in the cloud is not aligned with you; it’s aligned with the company that owns it.",
					engagements: {
						totalReactions: 451,
						commentsCount: 74,
						repostsCount: 15,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 388 },
							{ reactionType: "ENTERTAINMENT", reactionCount: 22 },
							{ reactionType: "INTEREST", reactionCount: 19 },
							{ reactionType: "EMPATHY", reactionCount: 14 },
							{ reactionType: "PRAISE", reactionCount: 8 },
						],
					},
					tms: 1777862352508,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7455549352305135616",
					type: "original",
					content:
						"More skills can make an AI agent worse.\n\nReusable skills are powerful because they turn repeatable work into structured workflows.\n\nBut once an agent has many skills, the key question becomes:\nCan it choose the right one?\n\nMost systems don’t load every full skill instruction every time.\nThey start with the skill name and description.\n\nOnly when there’s a match does the agent load the full instructions, templates, scripts, or reference files.\n\nSo the description is not just documentation.\nIt’s part of the routing system.\n\n\nA few things I’d pay attention to:\n\n1. Write narrow descriptions\nThe description should make it clear when to use the skill, and just as importantly, when not to use it.\n\n2. Avoid overlapping skills\nIf three skills can handle the same task, routing becomes messy fast.\n\n3. Turn only stable workflows into skills\nNot every repeated prompt deserves to become a skill. The best candidates are repeatable, high-value, and have a clear output standard.\n\n4. Scope permissions carefully\nA skill that can read files, call tools, or run scripts needs much tighter boundaries than a simple writing workflow.\n\n5. Review skills like product features\nSkills can become outdated. Someone has to maintain them, improve them, and remove the ones that no longer make sense.\n\n\nMy take:\nThe issue is not having “too many skills.”\nThe issue is having too many vague, overlapping, over-permissioned, or unmaintained skills.\n\nThe more skills an agent has, the more important it becomes to treat them like a workflow system.\n\n\nLearn more in our AI Academy \nhttps://lnkd.in/g7AjiHHh\n\n*From Demo to Production (20% discount code: VIBE20)",
					engagements: {
						totalReactions: 2197,
						commentsCount: 67,
						repostsCount: 203,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 2055 },
							{ reactionType: "INTEREST", reactionCount: 98 },
							{ reactionType: "EMPATHY", reactionCount: 29 },
							{ reactionType: "PRAISE", reactionCount: 8 },
							{ reactionType: "APPRECIATION", reactionCount: 6 },
							{ reactionType: "ENTERTAINMENT", reactionCount: 1 },
						],
					},
					tms: 1777541482998,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7455540514185187328",
					type: "original",
					content:
						"Hi team,\nI gathered 600+ AI mental models (I'm a digital hoarder)\nI find it useful to prepare for interviews and dig for references.\nhttps://lnkd.in/gkY-ehnC What do you think? Do you find it useful as well or is it just me?",
					engagements: {
						totalReactions: 1,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [{ reactionType: "INTEREST", reactionCount: 1 }],
					},
					tms: 1777539375826,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7455108918206304256",
					type: "original",
					content:
						"Brighten your day in 3 CLAUDE.md lines. This won't save your job, but it might get a few laughs during your workday: Ask Claude to act like a pirate and call you 'Captain' 🏴‍☠️ Here are 3 lines to drop in your CLAUDE.md:\n\nhttps://lnkd.in/gKMe33-D",
					engagements: {
						totalReactions: 13,
						commentsCount: 1,
						repostsCount: 0,
						reactions: [
							{ reactionType: "ENTERTAINMENT", reactionCount: 6 },
							{ reactionType: "LIKE", reactionCount: 6 },
							{ reactionType: "EMPATHY", reactionCount: 1 },
						],
					},
					tms: 1777436475326,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7453323490486747136",
					type: "original",
					content:
						"When will the first one-person unicorn startup emerge? A 1B company with all employees being AI agents?\nMeetup yesterday at #UTSStartups 👏",
					engagements: {
						totalReactions: 5,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [{ reactionType: "LIKE", reactionCount: 5 }],
					},
					tms: 1777010796186,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7452661240209776641",
					type: "original",
					content:
						"Interested in a demo of Minimis Flow Prototype 5 in Sydney? Not in Sydney and want to tune in regardless?\n\nIrfan will be representing Minimis at tonight's SydAR Meetup.\n\nThank you Patrick Catanzariti for the invitation and The Onset for hosting!\n\nLink to event: https://lnkd.in/g7Rh7U-W",
					engagements: {
						totalReactions: 12,
						commentsCount: 4,
						repostsCount: 2,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 4 },
							{ reactionType: "PRAISE", reactionCount: 3 },
							{ reactionType: "EMPATHY", reactionCount: 2 },
							{ reactionType: "APPRECIATION", reactionCount: 2 },
							{ reactionType: "INTEREST", reactionCount: 1 },
						],
					},
					tms: 1776852903416,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7452641926790414336",
					type: "original",
					content: "Hardware meetup for a change #SydAR\nNice to see the last few years’ progress!",
					engagements: {
						totalReactions: 7,
						commentsCount: 1,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 4 },
							{ reactionType: "EMPATHY", reactionCount: 2 },
							{ reactionType: "PRAISE", reactionCount: 1 },
						],
					},
					tms: 1776848298738,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7446865877016338433",
					type: "original",
					content:
						"**Interactive** explanation of the Claude Code agent loop. Brilliant and must-see for Agent Engineers: https://ccunpacked.dev/",
					engagements: {
						totalReactions: 1,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [{ reactionType: "LIKE", reactionCount: 1 }],
					},
					tms: 1775471181158,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7444661479720509440",
					type: "original",
					content:
						"To fellow agent builders:\nICYMI Anthropic provides an **interactive** context window explorer https://lnkd.in/grXqZ_jj\nInvaluable to understand this critical piece.",
					engagements: { totalReactions: 0, commentsCount: 0, repostsCount: 0, reactions: null },
					tms: 1774945611887,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7442146869281103872",
					type: "original",
					content:
						"Ethereum meetup at Sydney Haymarket HQ \nGreat presentations about: institutional vs cypherpunk, L1 vs L2 and the next Ethereum network updates.\nWho doesn’t like a vibrant tech space? 👏",
					engagements: {
						totalReactions: 5,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 4 },
							{ reactionType: "EMPATHY", reactionCount: 1 },
						],
					},
					tms: 1774346082039,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7339590812227334144",
					type: "reshare",
					content:
						'ICYMI Vercel shared the architecture of v0: https://lnkd.in/gxaAgQSt\n\nWorth a read!\nAmidst all the AI hype, Vercel kindly shared a real, working applied AI architecture 👏.\n\nThey describe how they built v0 (UI code generator) using a "composite model architecture" leveraging the unique strengths of frontier private models and dedicated custom models.\n\nAnd yes, this is not fake: I used v0 to generate a medium complexity, 3 screens UI with a dozen of controls. The code was not productionizable (plenty of bugs and rough edges) but it kickstarted my prototype ✅\n\nThanks Vercel for sharing! https://lnkd.in/gAhr4dsV',
					engagements: { totalReactions: 0, commentsCount: 0, repostsCount: 0, reactions: null },
					tms: 1749894812638,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7339590526339334145",
					type: "original",
					content:
						'Amidst all the AI hype, Vercel kindly shared a real, working applied AI architecture 👏.\n\nThey describe how they built v0 (UI code generator) using a "composite model architecture" leveraging the unique strengths of frontier private models and dedicated custom models.\n\nAnd yes, this is not fake: I used v0 to generate a medium complexity, 3 screens UI with a dozen of controls. The code was not productionizable (plenty of bugs and rough edges) but it kickstarted my prototype ✅\n\nThanks Vercel for sharing! https://lnkd.in/gAhr4dsV',
					engagements: {
						totalReactions: 5,
						commentsCount: 0,
						repostsCount: 1,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 4 },
							{ reactionType: "PRAISE", reactionCount: 1 },
						],
					},
					tms: 1749894744477,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7330067498693808129",
					type: "reshare",
					content:
						"Also: \"a codebase doesn't survive more than one magnitude of scale change\"\n17 Subtle Rules of Software Engineering:\n\n0. Stop falling in love with your own code \n1. You will regret complexity when on-call\n2. Everything is a trade-off. There's no \"best\"\n3. Every line of code you write is a liability\n4. Document your decisions and designs\n5. Everyone hates code they didn’t write\n6. Don't use unnecessary dependencies\n7. Coding standards prevent arguments\n8. Write meaningful commit messages\n9. Don't ever stop learning new things\n10. Code reviews spread knowledge\n11. Always build for maintainability\n12. Ask for help when you’re stuck\n13. Fix root causes, not symptoms\n14. Software is never completed\n15. Estimates are not promises\n16. Ship early, iterate often\n\nWhat did I miss?\n\n\n♻️ Repost if you agree.\nAnd follow Miko Pawlikowski 🎙️for more.",
					engagements: { totalReactions: 0, commentsCount: 0, repostsCount: 0, reactions: null },
					tms: 1747624277757,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7259373802315292673",
					type: "original",
					content:
						"We're in EAP for the new Navigation in Jira! But internally, we're dogfooding since July!\n\nI hope you like it!\n\nhttps://lnkd.in/g5GAbjqa",
					engagements: {
						totalReactions: 20,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 14 },
							{ reactionType: "EMPATHY", reactionCount: 4 },
							{ reactionType: "PRAISE", reactionCount: 2 },
						],
					},
					tms: 1730769587115,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7252863987631960064",
					type: "reshare",
					content: "Please signup to support my next RSU vest! *cha-chink*  😂",
					engagements: {
						totalReactions: 5,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "ENTERTAINMENT", reactionCount: 3 },
							{ reactionType: "APPRECIATION", reactionCount: 1 },
							{ reactionType: "LIKE", reactionCount: 1 },
						],
					},
					tms: 1729217526348,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7195207840964251649",
					type: "original",
					content:
						"Raise your hand if you're in denial Team '24 is over ✋ We can't believe it's a wrap on our favorite week of the year!\n\nThank you to all of our customers, Atlassians, vendors, sponsors, and partners for making our last year in Vegas the best one yet. #ImpossibleAlone\n\nSessions are now available on demand to watch anytime, anywhere. Watch now: https://bit.ly/3UPGoRS",
					engagements: {
						totalReactions: 261,
						commentsCount: 23,
						repostsCount: 11,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 200 },
							{ reactionType: "EMPATHY", reactionCount: 34 },
							{ reactionType: "PRAISE", reactionCount: 24 },
							{ reactionType: "APPRECIATION", reactionCount: 2 },
							{ reactionType: "INTEREST", reactionCount: 1 },
						],
					},
					tms: 1715471229783,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7053947947067043840",
					type: "reshare",
					content:
						"My team has 5 open positions for frontend engineers! Come join the best team ever!\nLooking for an exciting opportunity to shape how teams across the world get their work done 🚀 ? Atlassian is looking for Software Engineers to build out exciting features within Jira Software - the most popular and most powerful development tool for software teams in the world. This includes working on the onboarding, boards, and backlog grooming experience to name few. \n\nWhether you prefer to work remotely or in an office, as long as you have eligible working rights and a sufficient time zone overlap with your team, we welcome you to apply 🧑🏽‍💻\n\nAs part of our team, you will drive projects independently from technical design to launch, solve complex problems at scale, and mentor junior members. We're looking for engineers who have Front End and / or Backend skillsets.\n\nIf you're ready for a challenging yet rewarding career, apply via the link below or feel free to get in touch. Join us to unleash the potential of every team 👏🏽\n\n#hiring #jobs #tech #careers #softwareengineering\n\nSusana Guio Mena Carlos Khatchikian Joshua Carolan Bevan Blackie Yves-Emmanuel Jutard",
					engagements: {
						totalReactions: 14,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 11 },
							{ reactionType: "APPRECIATION", reactionCount: 2 },
							{ reactionType: "PRAISE", reactionCount: 1 },
						],
					},
					tms: 1681792246596,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:7041532431706853376",
					type: "reshare",
					content:
						"Amazing work from my org and some of my reports!\n📣 📣📣📣 🎉🎉 🎉 🎉 🎉 🎉 \n \nAttention to all Jira Software users!\n\nAnother exciting update from the Jira Software team: \nWe have been working on a number of enhancements in Jira Software to make your lives easier! From customized pinned fields and an improved advanced search, to an updated mobile app and time-saving enhancements on the backlog — we’re listening to you!\n\nLearn more about these enhancements we’ve made to your Jira experience focused on improving ease of use, and get a sneak peak of what’s coming next - because we're not stopping there!\n\nhttps://lnkd.in/gsWyUJ35\n\n#Jira #JiraSoftware #productmanager #teamwork #experience #team Atlassian Atlassian Jira",
					engagements: {
						totalReactions: 6,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [
							{ reactionType: "LIKE", reactionCount: 5 },
							{ reactionType: "PRAISE", reactionCount: 1 },
						],
					},
					tms: 1678832157065,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:6332362264523476992",
					type: "reshare",
					content:
						"Dashlane 5 is here! Today, we're unveiling new features, platforms, and so much more. Visit our blog to watch the Dashlane 5 video and see what's new.",
					engagements: {
						totalReactions: 1,
						commentsCount: 0,
						repostsCount: 0,
						reactions: [{ reactionType: "LIKE", reactionCount: 1 }],
					},
					tms: 1509752813464,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:6271486939615100928",
					type: "original",
					content: "Je viens de mettre à jour mon profil sur le site https://eseo-alumni.com",
					engagements: { totalReactions: 0, commentsCount: 0, repostsCount: 0, reactions: null },
					tms: 1495239004997,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:6268221349874016256",
					type: "reshare",
					content:
						"Motivation is key at work, my boss takes that into account!\nAs an executive, manager, or team leader, do you know what motivates your colleagues? Is it money? Power? Freedom? See how Dashlane Co-founder Guillaume Maron used a team exercise to learn what really motivates each member of his Engineering team. https://lnkd.in/dxF_6ak",
					engagements: { totalReactions: 0, commentsCount: 0, repostsCount: 0, reactions: null },
					tms: 1494460427731,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:6263581329410129920",
					type: "reshare",
					content:
						"We're excited to announce that we won a Webby Award! We won 2017 People's Choice Award for Best in Mobile Services & Utilities.\n\nThis win is as much yours as ours so thank you to everyone who helped make this happen. See our win:  https://lnkd.in/dcpuhU8",
					engagements: { totalReactions: 0, commentsCount: 0, repostsCount: 0, reactions: null },
					tms: 1493354160645,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:6258089632551047168",
					type: "reshare",
					content:
						"Dashlane is ranked 1st best utility so far!\nWhat does Dashlane, Beyonce & Game of Thrones have in common? We've all been nominated for \"the internet's highest honor\"-- A 2017 Webby Award!\nWe're competing for the for 'Best Service & Utility App' against some industry giants! Every vote counts! Do we have yours? Cast your vote here: https://lnkd.in/dk2dEif",
					engagements: { totalReactions: 0, commentsCount: 0, repostsCount: 0, reactions: null },
					tms: 1492044838083,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:6101725014762020864",
					type: "original",
					content: 'Liked "An Ambitious Wikidata Tutorial" on SlideShare',
					engagements: { totalReactions: 0, commentsCount: 0, repostsCount: 0, reactions: null },
					tms: 1454764608088,
				},
				{
					url: "https://www.linkedin.com/feed/update/urn:li:activity:6095564716501975040",
					type: "reshare",
					content: "OMNILOG recrute des développeur Symfony2, AngularJs/Node.js et .NET passionnés.",
					engagements: null,
					tms: 1453295878530,
				},
			]
		}

		if (!userⵧlinkdapi) return []

		return await GETꓽⳇpostsⳇall(clientⵧlinkdapi, {
			urn: userⵧlinkdapi.urn,
		})
	})()

	return Response.json({ userⵧlinkedin, userⵧlinkdapi, posts })
}
